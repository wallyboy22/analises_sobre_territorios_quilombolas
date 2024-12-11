// This script is think to google earth engine. Acess https://code.earthengine.google.com
// 11-12-2024 - Wallace Silva and Bárbara Costa
// shape
var quilombolas = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/incra_areas_de_quilombolas")//.limit(1);

print('quilombolas',quilombolas);
Map.addLayer(quilombolas,{color:'red'},'quilombolas');

// buffer no shape
var quilombolas_buffer = quilombolas.map(function(feature){
  return ee.Feature(feature.geometry().buffer(10000)).copyProperties(feature);
});

var quilombolas_somente_buffer = quilombolas.map(function(feature){
  return ee.Feature(feature.geometry().buffer(10000).difference(feature.geometry())).copyProperties(feature);
});

print('quilombolas_buffer',quilombolas_buffer);
Map.addLayer(quilombolas_buffer,{color:'green'},'quilombolas_buffer');

print('quilombolas_somente_buffer',quilombolas_somente_buffer);
Map.addLayer(quilombolas_somente_buffer,{color:'blue'},'quilombolas_somente_buffer');

var assetId = 'projects/ee-babecsilva-consultorias/assets/';

Export.table.toAsset({
  collection:quilombolas_buffer,
  description:'incra_areas_de_quilombolas_buffer_10km',
  assetId:assetId + 'incra_areas_de_quilombolas_buffer_10km',
  // maxVertices:,
  // priority:
});
  

Export.table.toAsset({
  collection:quilombolas_somente_buffer,
  description:'incra_areas_de_quilombolas_somente_buffer_10km',
  assetId:assetId + 'incra_areas_de_quilombolas_somente_buffer_10km',
  // maxVertices:,
  // priority:
});

///////////////////////////////
Export.table.toDrive({
  collection:quilombolas_buffer,
  description:'incra_areas_de_quilombolas_buffer_10km',
  folder:'analises_sobre_territorios_quilombolas', 
  fileNamePrefix:'incra_areas_de_quilombolas_buffer_10km',
  fileFormat:'shp',
});

Export.table.toDrive({
  collection:quilombolas_somente_buffer,
  description:'incra_areas_de_quilombolas_somente_buffer_10km',
  folder:'analises_sobre_territorios_quilombolas', 
  fileNamePrefix:'incra_areas_de_quilombolas_buffer_10km',
  fileFormat:'shp',
});