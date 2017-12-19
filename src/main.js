import jQuery from 'jquery';
// window.$ = window.JQuery = jQuery;
import 'bootstrap';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import 'lodash';
import Vue from 'vue';

// FusionCharts Illinois Map
import Illinois from './components/Illinois.vue';
import VueFusionCharts from 'vue-fusioncharts';
import FusionCharts from 'fusioncharts'
import Charts from 'fusioncharts/fusioncharts.charts'
import Maps from 'fusioncharts/fusioncharts.maps'
import IllinoisMap from '../static/vendor/fusioncharts/maps/fusioncharts.illinois.js';
Charts(FusionCharts);
Maps(FusionCharts);
IllinoisMap(FusionCharts);
Vue.use(VueFusionCharts, FusionCharts);


Vue.config.productionTip = false

import './scss/base.scss'

const APPS = {
    Illinois
};




function renderAppInElement(el) {
    let App = APPS[el.id];
    if (!App) return;

    // Props as data attributes:
    // <div class="__vue-root" data-message="Hello" id="Greet"></div>
    const props = Object.assign({}, el.dataset);
    console.log('Component: ', el.id)
    new Vue({
        el,
        render(createElem) {
            return createElem(App, {
                attrs: props
            });
        }
    })
}

document.querySelectorAll('.__vue-root').forEach(renderAppInElement)