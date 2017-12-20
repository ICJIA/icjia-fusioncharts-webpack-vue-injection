<template>
    <div id="factSheetDisplay">
        <div class="text-center">
            <div style="color: #aaa; font-family: 'Lato', sans-serif; font-weight: 900; margin-bottom: 15px; margin-top: 20px;">Display ARI Fact Sheet</div>
            <div class="panel panel-default factsheet" style="margin-top: 30px" v-if="visibility">
                    <div class="panel-heading">
                        <div class="panel-title" style="font-weight: 900; text-transform: uppercase">{{countyMetaData.title}}</div>
                    </div>
                    <div class="panel-body" style="text-align: left">
                        <div class="panel-text" v-html="countyMetaData.factSheet"></div>
                    </div>
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        props: ['countyMetaData', 'visibility'],
        name: 'DisplayFactSheet',
        mounted() {



        },
    }
</script>


<style>

</style>