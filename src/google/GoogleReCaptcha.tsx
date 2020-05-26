import {GoogleReCaptchaWebView} from "./GoogleReCaptchaWebView";



export class GoogleReCaptcha
{
    private static _instance: GoogleReCaptcha;

    private _web_view:GoogleReCaptchaWebView;

    public static getInstance(): GoogleReCaptcha
    {
        if (GoogleReCaptcha._instance == null)
        {
            GoogleReCaptcha._instance = new GoogleReCaptcha();
        }
        return this._instance;
    };
    public getToken(_done:(_token:string | null)=>void):void
    {
        if (this._web_view)
        {
            this._web_view.getToken(_done);
        }
        else
        {
            console.log("Google Recaptcha Web View is not init");
            _done(null)
        }
    }
    public initWebView(_web_view:GoogleReCaptchaWebView):void
    {
        this._web_view = _web_view;
    }
    constructor()
    {
        if(GoogleReCaptcha._instance)
        {
            throw new Error("Error: Instantiation failed: Use SingletonClass.getInstance() instead of new.");
        }
        //this.init();
    }
}