// --- --- --- datasets - table
var quilombolas = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/ISA/incra_areas_de_quilombolas");
var quilombolas_buffer = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/ISA/incra_areas_de_quilombolas_somente_buffer_10km");

var biomas = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/ISA/ibge_biomas_250mil");

// --- --- --- datasets - raster
var landcover = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');

var img_biomas = ee.Image().paint(biomas,'CD_Bioma');
// --- --- --- 
var remap_classes = [
  1,  3,  4,  5,  6,  49, 10, 11, 12, 32, 50, 13
];

var landcover_nivel_1 = landcover.multiply(0);

remap_classes.forEach(function(a){
  landcover_nivel_1 = landcover_nivel_1.where(landcover.eq(a),1);
});

var number_of_changes = landcover_nivel_1.reduce(ee.Reducer.countRuns());

// --- --- --- print and plot
print('number_of_changes',number_of_changes);
Map.addLayer(number_of_changes,{min:0,max:10},'number_of_changes');

print('landcover',landcover);
Map.addLayer(landcover,{bands:['classification_2023'],min:0,max:69,palette:require('users/mapbiomas/modules:Palettes.js').get('classification9')},'landcover');

print('quilombolas',quilombolas);
Map.addLayer(quilombolas,{color:'red'},'quilombolas');

print('quilombolas_buffer',quilombolas_buffer);
Map.addLayer(quilombolas_buffer,{color:'blue'},'quilombolas_buffer');

// --- --- --- area calculate
// --- --- auxiliar
var nivels = {
  biomas: ee.Dictionary({
      0:'Não Observado',
      1:'Amazônia',
      2:'Caatonga',
      3:'Cerrado',
      4:'Mata Atlântica',
      5:'Pampa',
      6:'Pantanal',
  })
};
// --- --- calculate
var area = ee.Image.pixelArea().divide(1e4);
  var table = ee.FeatureCollection(area
      .addBands(number_of_changes.multiply(10).add(img_biomas))
      .reduceRegions({
        collection:quilombolas,
        reducer:ee.Reducer.sum().group(1,'classe'),
        scale:30,
      }).map(function(a){
        return ee.FeatureCollection(ee.List(a.get('groups')).map(function(obj){
          obj = ee.Dictionary(obj);
          
          var classe_int = obj.getNumber('classe').divide(10).int();
          var classe_territory = obj.getNumber('classe').mod(10).int();
          
          return ee.Feature(null)
            .set({
              'area_ha':obj.get('sum'),
              'number_of_changes':classe_int,
              'bioma':nivels.biomas.get(classe_territory),
              
              'cd_quilomb':a.get('cd_quilomb'),
              // 'cd_sipra':a.get('cd_sipra'),
              // 'cd_sr':a.get('cd_sr'),
              'cd_uf':a.get('cd_uf'),
              // 'dt_decreto':a.get('dt_decreto'),
              // 'dt_public1':a.get('dt_public1'),
              // 'dt_publica':a.get('dt_publica'),
              // 'dt_titulac':a.get('dt_titulac'),
              'esfera':a.get('esfera'),
              // 'fase':a.get('fase'),
              'nm_comunid':a.get('nm_comunid'),
              'nm_municip':a.get('nm_municip'),
              'nr_area_ha':a.get('nr_area_ha'),
              // 'nr_escalao':a.get('nr_escalao'),
              'nr_familia':a.get('nr_familia'),
              // 'nr_perimet':a.get('nr_perimet'),
              'nr_process':a.get('nr_process'),
              // 'ob_descric':a.get('ob_descric'),
              // 'responsave':a.get('responsave'),
              // 'st_titulad':a.get('st_titulad'),
              // 'tp_levanta':a.get('tp_levanta'),
            });
        }));
      })
    ).flatten();

  print(table);
  
  Export.table.toDrive({
    collection:table,
    description:'LULC_NUMBER_OF_CHANGES-incra_areas_de_quilombolas',
    folder:'analises_sobre_territorios_quilombolas',
    fileNamePrefix:'LULC_NUMBER_OF_CHANGES-incra_areas_de_quilombolas',
    fileFormat:'csv',
    selectors:[
      'area_ha',
      'number_of_changes',
      'bioma',
      'nm_municip',
      'cd_quilomb',
      'nm_comunid',
      'nr_area_ha',
      'nr_familia',
      'nr_process',
      'esfera',
      ],
  })
  
  ///////
  var table_buffer = ee.FeatureCollection(area
    .addBands(number_of_changes.multiply(10).add(img_biomas))
    .reduceRegions({
      collection:quilombolas_buffer,
      reducer:ee.Reducer.sum().group(1,'classe'),
      scale:30,
    }).map(function(a){
      return ee.FeatureCollection(ee.List(a.get('groups')).map(function(obj){
        obj = ee.Dictionary(obj);
        
        var classe_int = obj.getNumber('classe').divide(10).int();
        var classe_territory = obj.getNumber('classe').mod(10).int();
        
        return ee.Feature(null)
          .set({
            'area_ha':obj.get('sum'),
            'number_of_changes':classe_int,
            'bioma_int':classe_territory,
            'bioma':nivels.biomas.get(classe_territory),
            
            'cd_quilomb':a.get('cd_quilomb'),
            // 'cd_sipra':a.get('cd_sipra'),
            // 'cd_sr':a.get('cd_sr'),
            'cd_uf':a.get('cd_uf'),
            // 'dt_decreto':a.get('dt_decreto'),
            // 'dt_public1':a.get('dt_public1'),
            // 'dt_publica':a.get('dt_publica'),
            // 'dt_titulac':a.get('dt_titulac'),
            'esfera':a.get('esfera'),
            // 'fase':a.get('fase'),
            'nm_comunid':a.get('nm_comunid'),
            'nm_municip':a.get('nm_municip'),
            'nr_area_ha':a.get('nr_area_ha'),
            // 'nr_escalao':a.get('nr_escalao'),
            'nr_familia':a.get('nr_familia'),
            // 'nr_perimet':a.get('nr_perimet'),
            'nr_process':a.get('nr_process'),
            // 'ob_descric':a.get('ob_descric'),
            // 'responsave':a.get('responsave'),
            // 'st_titulad':a.get('st_titulad'),
            // 'tp_levanta':a.get('tp_levanta'),
          });
      }));
    })
  ).flatten();

print(table_buffer);

Export.table.toDrive({
  collection:table_buffer,
  description:'LULC_NUMBER_OF_CHANGES-incra_areas_de_quilombolas_buffer',
  folder:'analises_sobre_territorios_quilombolas',
  fileNamePrefix:'LULC_NUMBER_OF_CHANGES-incra_areas_de_quilombolas_buffer',
  fileFormat:'csv',
  selectors:[
    'area_ha',
    'number_of_changes',
    'bioma',
    'nm_municip',
    'cd_quilomb',
    'nm_comunid',
    'nr_area_ha',
    'nr_familia',
    'nr_process',
    'esfera',
    ],
});
