import jQuery from 'jquery-slim';
window.$ = window.JQuery = jQuery;
import 'bootstrap';
import moment from 'moment'
import 'lodash';
import Vue from 'vue';



// Vue components for app
import Illinois from './components/home/Illinois.vue';

const APPS = {
    Illinois
};


// FusionCharts Illinois Map
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import Maps from 'fusioncharts/fusioncharts.maps'
import IllinoisMap from '../static/vendor/fusioncharts/maps/fusioncharts.illinois.js';
Charts(FusionCharts);
Maps(FusionCharts);
IllinoisMap(FusionCharts);
Vue.use(VueFusionCharts, FusionCharts);





// import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../scss/base.scss'

Vue.config.productionTip = false



function renderAppInElement(el) {
    let App = APPS[el.id];
    if (!App) return;

    // Props as data attributes:
    // <div class="__vue-root" data-message="Hello" id="Greet"></div>
    const props = Object.assign({}, el.dataset);
    console.log('Load component: ', el.id)
    new Vue({
        el,
        data: { global: 'global' },
        render(createElem) {
            return createElem(App, {
                attrs: props
            });
        }
    })
}

document.addEventListener("DOMContentLoaded", function(event) {
    document.querySelectorAll('.__vue-root').forEach(renderAppInElement)
});