const o2 = window.o2;
const layout = window.layout;
let component, lp;

class Component{
    constructor(name, provider, options){
        this.name = name;
        this.options = options;
        this.provider = provider;
        this._initComponent();
        this._defineComponent();
    }
    _initComponent() {
        const op = (this.options) || {};
        const path = this.name.split('.');
        this.component = o2.xApplication;
        path.forEach((p) => {
            this.component = this.component[p] = this.component[p] || {};
        });
        if (!this.component.options) this.component.options = {};
        this.component.options.multitask = !!op.multitask;
    }
    _defineComponent(){
        const op = (this.options) || {};
        const provider = this.provider;
        const o2component = this.component;
        o2component.Main = new window.Class({
            Extends: o2.xApplication.Common.Main,
            Implements: [window.Options, window.Events],
            options: Object.assign(this._defaultComponentOptions(), op),
            onQueryLoad: function (){
                this.lp = o2component.LP;
                this.options.title = this.lp.title;
                component = this;
                lp = this.lp;
            },
            loadApplication: function(callback){
                const app = provider(this.content, ()=>{
                    if (callback) callback();
                });
                this.addEvent('queryClose', ()=>{
                    if (app && app.unmount) app.unmount();
                });
            }
        });
    }
    _defaultComponentOptions(){
        return {
            "style": "default",
            "name": this.name,
            "mvcStyle": "style.css",
            "icon": "icon.png",
            "title": ""
        }
    }
    render(){
        if (layout.inBrowser && window.location.href.indexOf('x_desktop')===-1){
            Promise.resolve(((layout.session && layout.session.user) || layout.sessionPromise)).then(()=>{
                layout.apps = [];
                layout.openApplication(null, this.name);
            });
        }
    }
}

const loadComponent = function(name, provider, options){
    return new Promise((resolve)=>{
        layout.addReady(()=>{
            const c = new Component(name, provider, (options || {}));
            resolve(c);
        });
    });
}
export {o2, layout, component, lp, loadComponent};
