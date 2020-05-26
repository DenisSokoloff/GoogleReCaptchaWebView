import * as React from "react";
import WebView from "react-native-webview";
import {View} from "react-native";

export interface GoogleReCaptchaProps
{
    captchaDomain:string,
    siteKey:string,
}
export interface GoogleReCaptchaStates {}

export class GoogleReCaptchaWebView extends React.Component<GoogleReCaptchaProps, GoogleReCaptchaStates>
{
    private _ready:boolean = false;

    private _webViewRef:WebView;
    private _request_index:number = 0;
    private _request_handlers:((_token:string)=>void)[] = [];

    private _stock:number[] = []

    private getContent = (siteKey: string) =>
    {
        return `<!DOCTYPE html>
                <html>
                    <head>
                        <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
                        <script>
                            window.info = null;
                            
                            var getToken = function(_index)
                            {
                                if (window.info) window.info.innerText = "getToken";
                                grecaptcha.ready(function() 
                                {
                                    grecaptcha.execute('${siteKey}', {action: 'homepage'}).then(function(token) 
                                    {
                                        if (window.info) window.info.innerText = "token:" + token;
                                        
                                        var result = {"type":"token", "index":_index, "token":token};
                                        window.ReactNativeWebView.postMessage(JSON.stringify(result));       
                                    });
                                });
                            }
                            document.addEventListener("DOMContentLoaded", function() 
                            {
                                var result = {"type":"onload"};
                                window.ReactNativeWebView.postMessage(JSON.stringify(result));
                            });
                            
                        </script>
                    </head>
                    <body style="font-size: 40px;">
                        Google Captcha Init
                        <div style="font-size: 60px;" id="info"></div>
                        <script>
                            window.info = document.getElementById("info");
                            if (window.info) window.info.innerText = "INFO AREA IS READY";
                        </script>
                    </body>
                </html>`;
    };

    constructor(_props: GoogleReCaptchaProps)
    {
        super(_props);
        this.state = {};
    }
    private stockAction():void
    {
        let n:number = this._stock.length;
        if (n > 0)
        {
            let index:number;
            for (let i:number = 0; i < n; i++)
            {
                index = this._stock[i];
                this._webViewRef.injectJavaScript("getToken("+index+");true;");

            }
        }
    }
    public getToken = (_done:(_token:string | null)=>void) =>
    {
        this._request_index++;
        this._request_handlers[this._request_index] = _done;

        if (this._ready)
        {
            //console.log("Try to injectJavaScript", this._request_index);
            this._webViewRef.injectJavaScript("getToken("+this._request_index+");true;");
        }
        else
        {
            this._stock.push(this._request_index);
        }


        /*
        const run = `document.body.style.backgroundColor = 'blue';true;`;
        setTimeout(() => {
            this._webViewRef.injectJavaScript(run);
            this._webViewRef.injectJavaScript("getToken("+this._request_index+");true;");
        }, 3000);
        */

    };
    private done = (result:any):void =>
    {
        try
        {
            this._request_handlers[result.index](result.token);
            delete this._request_handlers[result.index];
        }
        catch (e)
        {

        }

    }
    render()
    {
        let html:string = this.getContent(this.props.siteKey);
        let url:string  = this.props.captchaDomain;

        //console.log(html, url);

        let obj: JSX.Element = <View style={{width:0, height:0, opacity:0}}>

                                    <WebView

                                        ref={(ref:WebView) => {this._webViewRef = ref}}
                                        //originWhitelist = {['about:blank']}
                                        originWhitelist={['*']}

                                        javaScriptEnabled={true}
                                        automaticallyAdjustContentInsets={true}
                                        mixedContentMode = {'always'}

                                        source={
                                            {
                                                html: html,
                                                baseUrl: url
                                                //uri:"https://facebook.github.io/react-native/"
                                            }}
                                        onMessage={(e: any) =>
                                        {
                                            //console.log("POST MESSAGE FROM GOOGLE ", e.nativeEvent.data);
                                            var result = JSON.parse(e.nativeEvent.data);
                                            if (result) {
                                                switch (result.type)
                                                {
                                                    case "onload":
                                                        this._ready = true;
                                                        this.stockAction();
                                                        break;

                                                    case "token":
                                                        this.done(result);
                                                        break;
                                                }
                                            }



                                        }}
                                    />
                                </View>;
        return obj;
    }
    //<WebView source={{ uri: 'https://facebook.github.io/react-native/' }} />

}