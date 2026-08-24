!(function loadPostHog(documentObject, posthogObject) {
    var methods;
    var index;
    var script;
    var firstScript;

    if (posthogObject.__SV) return;

    window.posthog = posthogObject;
    posthogObject._i = [];
    posthogObject.init = function initPostHog(projectToken, config, instanceName) {
        function queueMethod(target, methodName) {
            var parts = methodName.split(".");
            if (parts.length === 2) {
                target = target[parts[0]];
                methodName = parts[1];
            }
            target[methodName] = function queueCall() {
                target.push([methodName].concat(Array.prototype.slice.call(arguments, 0)));
            };
        }

        script = documentObject.createElement("script");
        script.type = "text/javascript";
        script.crossOrigin = "anonymous";
        script.async = true;
        script.src = config.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js";
        firstScript = documentObject.getElementsByTagName("script")[0];
        firstScript.parentNode.insertBefore(script, firstScript);

        var instance = posthogObject;
        if (instanceName !== undefined) {
            instance = posthogObject[instanceName] = [];
        } else {
            instanceName = "posthog";
        }

        instance.people = instance.people || [];
        instance.toString = function toString(includePeople) {
            var label = "posthog";
            if (instanceName !== "posthog") label += "." + instanceName;
            if (!includePeople) label += " (stub)";
            return label;
        };
        instance.people.toString = function peopleToString() {
            return instance.toString(1) + ".people (stub)";
        };

        methods = "init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(" ");
        for (index = 0; index < methods.length; index += 1) queueMethod(instance, methods[index]);
        posthogObject._i.push([projectToken, config, instanceName]);
    };
    posthogObject.__SV = 1;
})(document, window.posthog || []);

window.posthog.init("phc_DbsPb39SRc8z3EiQ6Dhj6ikv4H4rTKcht9d4sZSesceP", {
    api_host: "https://ap.emergent.sh",
    person_profiles: "identified_only",
    session_recording: {
        maskAllInputs: true,
        recordCrossOriginIframes: false,
        capturePerformance: false,
    },
});
