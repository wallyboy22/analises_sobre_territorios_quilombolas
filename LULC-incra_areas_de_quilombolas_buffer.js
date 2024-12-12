// --- --- --- datasets - table
var quilombolas = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/ISA/incra_areas_de_quilombolas");
var quilombolas_buffer = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/ISA/incra_areas_de_quilombolas_somente_buffer_10km");

var biomas = ee.FeatureCollection("projects/ee-babecsilva-consultorias/assets/ISA/ibge_biomas_250mil");

// --- --- --- datasets - raster
var landcover = ee.Image('projects/mapbiomas-public/assets/brazil/lulc/collection9/mapbiomas_collection90_integration_v1');

var img_biomas = ee.Image().paint(biomas,'CD_Bioma');

// --- --- --- print and plot
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
  }),
  lulc_mbc09_niveis: ee.Dictionary({
      0:'Não Observado',
      1:'Nível 1',
      3:'Nível 2',
      4:'Nível 2',
      5:'Nível 2',
      6:'Nível 2',
      49:'Nível 2',
      10:'Nível 1',
      11:'Nível 2',
      12:'Nível 2',
      32:'Nível 2',
      29:'Nível 2',
      50:'Nível 2',
      13:'Nível 2',
      14:'Nível 1',
      15:'Nível 2',
      18:'Nível 2',
      19:'Nível 3',
      39:'Nível 4',
      20:'Nível 4',
      40:'Nível 4',
      62:'Nível 4',
      41:'Nível 4',
      36:'Nível 3',
      46:'Nível 4',
      47:'Nível 4',
      35:'Nível 4',
      48:'Nível 4',
      9:'Nível 2',
      21:'Nível 2',
      22:'Nível 1',
      23:'Nível 2',
      24:'Nível 2',
      30:'Nível 2',
      25:'Nível 2',
      26:'Nível 1',
      33:'Nível 2',
      31:'Nível 3',
      27:'Nível 1',
  }),
  lulc_mbc09_nivel_0: ee.Dictionary({
    0:'Antrópico',
    1:'Natural',
    3:'Natural',
    4:'Natural',
    5:'Natural',
    6:'Natural',
    49:'Natural',
    10:'Natural',
    11:'Natural',
    12:'Natural',
    32:'Natural',
    29:'Antrópico',
    50:'Natural',
    13:'Natural',
    14:'Antrópico',
    15:'Antrópico',
    18:'Antrópico',
    19:'Antrópico',
    39:'Antrópico',
    20:'Antrópico',
    40:'Antrópico',
    62:'Antrópico',
    41:'Antrópico',
    36:'Antrópico',
    46:'Antrópico',
    47:'Antrópico',
    35:'Antrópico',
    48:'Antrópico',
    9: 'Antrópico',
    21:'Antrópico',
    22:'Antrópico',
    23:'Antrópico',
    24:'Antrópico',
    30:'Antrópico',
    25:'Antrópico',
    26:'Antrópico',
    33:'Antrópico',
    31:'Antrópico',
    27:'Antrópico', 
  }),
  lulc_mbc09_nivel_1: ee.Dictionary({
    0:'Área não vegetada',  
    1:'Floresta',
    3:'Floresta',
    4:'Floresta',
    5:'Floresta',
    6:'Floresta',
    49:'Floresta',
    10:'Formação Natural não Florestal',
    11:'Formação Natural não Florestal',
    12:'Formação Natural não Florestal',
    32:'Formação Natural não Florestal',
    29:'Área não vegetada',
    50:'Formação Natural não Florestal',
    13:'Formação Natural não Florestal',
    14:'Agropecuária',
    15:'Agropecuária',
    18:'Agropecuária',
    19:'Agropecuária',
    39:'Agropecuária',
    20:'Agropecuária',
    40:'Agropecuária',
    62:'Agropecuária',
    41:'Agropecuária',
    36:'Agropecuária',
    46:'Agropecuária',
    47:'Agropecuária',
    35:'Agropecuária',
    48:'Agropecuária',
    9:'Agropecuária',
    21:'Agropecuária',
    22:'Área não vegetada',
    23:'Área não vegetada',
    24:'Área não vegetada',
    30:'Área não vegetada',
    25:'Área não vegetada',
    26:'Corpos D´água',
    33:'Corpos D´água',
    31:'Corpos D´água',
    27:'Área não vegetada', 
  }),
  lulc_mbc09_nivel_1_1: ee.Dictionary({
    0:'Outros',  
    1:'Formação Florestal',
    3:'Formação Florestal',
    4:'Formação Savânica',
    5:'Formação Florestal',
    6:'Formação Florestal',
    49:'Formação Savânica',
    10:'Formação Campestre',
    11:'Campo Alagado e Área Pantanosa',
    12:'Formação Campestre',
    32:'Formação Campestre',
    29:'Outros',
    50:'Formação Campestre',
    13:'Formação Campestre',
    14:'Agropecuária',
    15:'Pastagem',
    18:'Agricultura',
    19:'Agricultura',
    39:'Agricultura',
    20:'Agricultura',
    40:'Agricultura',
    62:'Agricultura',
    41:'Agricultura',
    36:'Agricultura',
    46:'Agricultura',
    47:'Agricultura',
    35:'Agricultura',
    48:'Agricultura',
    9:'Silvicultura',
    21:'Mosaico de Usos',
    22:'Outros',
    23:'Outros',
    24:'Outros',
    30:'Outros',
    25:'Outros',
    26:'Outros',
    33:'Outros',
    31:'Outros',
    27:'Outros',
  }),
  lulc_mbc09_nivel_2: ee.Dictionary({
    0:'Outras Áreas não Vegetadas',  
    1:'Floresta',
    3:'Formação Florestal',
    4:'Formação Savânica',
    5:'Mangue',
    6:'Floresta Alagável',
    49:'Restinga Arbórea',
    10:'Formação Natural não Florestal',
    11:'Campo Alagado e Área Pantanosa',
    12:'Formação Campestre',
    32:'Apicum',
    29:'Afloramento Rochoso',
    50:'Restinga herbácea',
    13:'Outras Formações não Florestais',
    14:'Agropecuária',
    15:'Pastagem',
    18:'Agricultura',
    19:'Agricultura',
    39:'Agricultura',
    20:'Agricultura',
    40:'Agricultura',
    62:'Agricultura',
    41:'Agricultura',
    36:'Agricultura',
    46:'Agricultura',
    47:'Agricultura',
    35:'Agricultura',
    48:'Agricultura',
    9:'Silvicultura',
    21:'Mosaico de Usos',
    22:'Área não vegetada',
    23:'Praia e Duna',
    24:'Área Urbanizada',
    30:'Mineração',
    25:'Outras Áreas não Vegetadas',
    26:'Corpos D´água',
    33:'Rios, Lagos e Oceano',
    31:'Aquicultura',
    27:'Outras Áreas não Vegetadas',
  }),
  lulc_mbc09_nivel_3: ee.Dictionary({
    0:'Outras Áreas não Vegetadas',  
    1:'Floresta',
    3:'Formação Florestal',
    4:'Formação Savânica',
    5:'Mangue',
    6:'Floresta Alagável',
    49:'Restinga Arbórea',
    10:'Formação Natural não Florestal',
    11:'Campo Alagado e Área Pantanosa',
    12:'Formação Campestre',
    32:'Apicum',
    29:'Afloramento Rochoso',
    50:'Restinga herbácea',
    13:'Outras Formações não Florestais',
    14:'Agropecuária',
    15:'Pastagem',
    18:'Agricultura',
    19:'Lavoura Temporária',
    39:'Lavoura Temporária',
    20:'Lavoura Temporária',
    40:'Lavoura Temporária',
    62:'Lavoura Temporária',
    41:'Lavoura Temporária',
    36:'Lavoura Perene',
    46:'Lavoura Perene',
    47:'Lavoura Perene',
    35:'Lavoura Perene',
    48:'Lavoura Perene',
    9:'Silvicultura',
    21:'Mosaico de Usos',
    22:'Área não vegetada',
    23:'Praia e Duna',
    24:'Área Urbanizada',
    30:'Mineração',
    25:'Outras Áreas não Vegetadas',
    26:'Corpos D´água',
    33:'Rios, Lagos e Oceano',
    31:'Aquicultura',
    27:'Outras Áreas não Vegetadas',
  }),
  lulc_mbc09_nivel_4: ee.Dictionary({
    0:'Outras Áreas não Vegetadas',    
    1:'Floresta',
    3:'Formação Florestal',
    4:'Formação Savânica',
    5:'Mangue',
    6:'Floresta Alagável',
    49:'Restinga Arbórea',
    10:'Formação Natural não Florestal',
    11:'Campo Alagado e Área Pantanosa',
    12:'Formação Campestre',
    32:'Apicum',
    29:'Afloramento Rochoso',
    50:'Restinga herbácea',
    13:'Outras Formações não Florestais',
    14:'Agropecuária',
    15:'Pastagem',
    18:'Agricultura',
    19:'Lavoura Temporária',
    39:'Soja',
    20:'Cana',
    40:'Arroz',
    62:'Algodão',
    41:'Outras Lavouras Temporárias',
    36:'Lavoura Perene',
    46:'Café',
    47:'Citrus',
    35:'Dendê',
    48:'Outras Lavouras Perenes',
    9:'Silvicultura',
    21:'Mosaico de Usos',
    22:'Área não Vegetada',
    23:'Praia e Duna',
    24:'Área Urbanizada',
    30:'Mineração',
    25:'Outras Áreas não Vegetadas',
    26:'Corpos D´água',
    33:'Rios, Lagos e Oceano',
    31:'Aquicultura',
    27:'Outras Áreas não Vegetadas',  
  }),
};
// --- --- calculate
var area = ee.Image.pixelArea().divide(1e4);
landcover.bandNames().evaluate(function(bandnames){
  var table = bandnames.map(function(bandname){
    return ee.FeatureCollection(area
      .addBands(landcover.select(bandname).multiply(10).add(img_biomas))
      .reduceRegions({
        collection:quilombolas,
        reducer:ee.Reducer.sum().group(1,'classe'),
        scale:500,
      }).map(function(a){
        return ee.FeatureCollection(ee.List(a.get('groups')).map(function(obj){
          obj = ee.Dictionary(obj);
          
          var classe_int = obj.getNumber('classe').divide(10).int();
          var classe_territory = obj.getNumber('classe').mod(10).int();
          
          return ee.Feature(null)
            .set({
              'area_ha':obj.get('sum'),
              'classe_int':classe_int,
              'bioma_int':classe_territory,
              'bioma':nivels.biomas.get(classe_territory),
              'nivel_0':nivels.lulc_mbc09_nivel_0.get(classe_int),
              'nivel_1':nivels.lulc_mbc09_nivel_1.get(classe_int),
              'nivel_2':nivels.lulc_mbc09_nivel_2.get(classe_int),
              'nivel_3':nivels.lulc_mbc09_nivel_3.get(classe_int),
              'nivel_4':nivels.lulc_mbc09_nivel_4.get(classe_int),
              
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
  });
  
  table = ee.FeatureCollection(table).flatten();
  
  print(table);
  
  Export.table.toDrive({
    collection:table,
    description:'LULC-incra_areas_de_quilombolas',
    folder:'analises_sobre_territorios_quilombolas',
    fileNamePrefix:'LULC-incra_areas_de_quilombolas',
    fileFormat:'csv',
    selectors:[
      'area_ha',
      'classe_int',
      'bioma',
      'cd_uf',
      'nivel_0',
      'nivel_1',
      'nivel_2',
      'nivel_3',
      'nivel_4',
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
    var table_buffer = bandnames.map(function(bandname){
    return ee.FeatureCollection(area
      .addBands(landcover.select(bandname).multiply(10).add(img_biomas))
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
              'classe_int':classe_int,
              'bioma_int':classe_territory,
              'bioma':nivels.biomas.get(classe_territory),
              'nivel_0':nivels.lulc_mbc09_nivel_0.get(classe_int),
              'nivel_1':nivels.lulc_mbc09_nivel_1.get(classe_int),
              'nivel_2':nivels.lulc_mbc09_nivel_2.get(classe_int),
              'nivel_3':nivels.lulc_mbc09_nivel_3.get(classe_int),
              'nivel_4':nivels.lulc_mbc09_nivel_4.get(classe_int),
              
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
  });
  
  table_buffer = ee.FeatureCollection(table_buffer).flatten();
  
  print(table_buffer);
  
  Export.table.toDrive({
    collection:table_buffer,
    description:'LULC-incra_areas_de_quilombolas_buffer',
    folder:'analises_sobre_territorios_quilombolas',
    fileNamePrefix:'LULC-incra_areas_de_quilombolas_buffer',
    fileFormat:'csv',
    selectors:[
      'area_ha',
      'classe_int',
      'bioma',
      'cd_uf',
      'nivel_0',
      'nivel_1',
      'nivel_2',
      'nivel_3',
      'nivel_4',
      'nm_municip',
      'cd_quilomb',
      'nm_comunid',
      'nr_area_ha',
      'nr_familia',
      'nr_process',
      'esfera',
      ],
  });
  
});
