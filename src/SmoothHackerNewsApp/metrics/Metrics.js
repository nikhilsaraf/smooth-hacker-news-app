/**
 * @flow
 */

import { NativeModules, Platform } from 'react-native';
import { Segment } from 'expo';
import Version from '../version/version.json';
import SegmentApiKey from '../api-keys/segment.json';

export default class Metrics {

    constructor(deviceMetadata) {
        this._deviceMetadata = deviceMetadata;
    }

    static makeInitialized() {
        const deviceMetadata = Metrics._deviceMetadata();
        console.log(deviceMetadata);
        const metrics = new Metrics(deviceMetadata);
        metrics.init();
        return metrics;
    }

    bindTab(tabName) {
        return new Metrics(Object.assign({}, this._deviceMetadata, {
            tabName: tabName
        }));
    }

    bindSource(sourceName) {
        return new Metrics(Object.assign({}, this._deviceMetadata, {
            sourceName: sourceName
        }));
    }

    init() {
        try {
            const apiKey = SegmentApiKey.api_key;
            if (Platform.OS == 'ios') {
                Segment.initializeIOS(apiKey);
            } else {
                Segment.initializeAndroid(apiKey);
            }
            // _deviceId is being passed for the segment userId
            Segment.identifyWithTraits(this._deviceMetadata._deviceId, this._timingBlanket(this._userBlanket()));
            this.track('initialized', this._timingBlanket(this._userBlanket()));
        } catch (error) {
            console.log('error while initializing: ' + error);
        }
        
    }

    // data is optional
    track(eventName, data) {
        return new Promise(() => {
            try {
                Segment.trackWithProperties(eventName, this._timingBlanket(this._userBlanket(data)));
            } catch (error) {
                console.log('error while tracking event: ' + error);
            }
        });
    }

    // data is optional
    trackNavigation(fromScreenName, toScreenName, data) {
        return new Promise(() => {
            try {
                Segment.trackWithProperties('Navigation', this._timingBlanket(this._userBlanket(this._extend(data, {
                    fromScreen: fromScreenName,
                    toScreen: toScreenName
                }))));
            } catch (error) {
                console.log('error while tracking navigation: ' + error);
            }
        });
    }

    static _deviceMetadata() {
        const exponentConstants = NativeModules.ExponentConstants;

        const deviceId = exponentConstants.deviceId;
        const deviceName = exponentConstants.deviceName;
        const deviceYearClass = exponentConstants.deviceYearClass;
        const platform = Platform.OS;
        const version = Version.version

        return {
            _deviceId: deviceId,
            _deviceName: deviceName,
            _deviceYearClass: deviceYearClass,
            _platform: platform,
            _version: version
        };
    }

    _timingBlanket(data) {
        const date = new Date();
        return this._extend(data, {
            _time: date.getTime(),
            _time_string: date.toUTCString()
        });
    }

    _userBlanket(data) {
        return this._extend(data, this._deviceMetadata);
    }

    _extend(data, additionalData) {
        const inputData = data || {};
        return Object.assign({}, inputData, additionalData);
    }
}