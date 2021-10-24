import { createApp } from 'vue';

const o2 = window.o2;
const layout = window.layout;

class Component{
    constructor(name, app, options){
        this.name = name;
        this.options = options;
        this.vueApp = app;
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
        const app = this.vueApp;
        const component = this.component;
        component.Main = new window.Class({
            Extends: o2.xApplication.Common.Main,
            Implements: [window.Options, window.Events],
            options: Object.assign(this._defaultComponentOptions(), op),
            onQueryLoad: function (){
                this.lp = component.LP;
                this.options.title = this.lp.title;
            },
            loadApplication: function(callback){
                app.mounted = callback;
                app.o2component = this;
                this.vueApp = app;
                createApp(app).mount(this.content);
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

const loadComponent = function(name, app, options){
    return new Promise((resolve)=>{
        layout.addReady(()=>{
            const c = new Component(name, app, (options || {}));
            resolve(c);
        });
    });
}
export {o2, layout, loadComponent};
