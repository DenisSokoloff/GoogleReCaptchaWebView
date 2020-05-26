import * as React from "react";
import {GoogleReCaptchaWebView} from "../google/GoogleReCaptchaWebView";
import {GoogleReCaptcha} from "../google/GoogleReCaptcha";

import RootSiblings from "react-native-root-siblings";

export class LoadingScreen extends React.Component<MainProps, MainStates>
{
    componentDidMount():void
    {

        let sibling = new RootSiblings(
            <View style={{position: "absolute", left: 0, top: 0, backgroundColor: "#C00"}}>
                <GoogleReCaptchaWebView
                    captchaDomain={AppSettings.GOOGLE_CAPTCHA_DOMAIN}
                    siteKey={AppSettings.GOOGLE_CAPTCHA_KEY}
                    ref={(ref: GoogleReCaptchaWebView) => {
                        console.log("GoogleReCaptchaWebView INIT");
                        GoogleReCaptcha.getInstance().initWebView(ref);

                        /*
                        console.log("GoogleReCaptcha getToken");
                        GoogleReCaptcha.getInstance().getToken((_token:string | null) =>
                        {
                            console.log("GoogleReCaptcha", _token);
                        });
                        */

                    }}
                />
            </View>);

    }
    constructor(_props: MainProps)
    {
        super(_props);
        this.state = {};
    }
    render()
    {
        let obj: JSX.Element =
            <View></View>;
        return obj;
    }

}