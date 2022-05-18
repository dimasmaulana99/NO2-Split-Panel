var maskwater = function(image) {
var waterOcc = ee.Image("JRC/GSW1_0/GlobalSurfaceWater").select('occurrence'),
  jrc_data0 = ee.Image("JRC/GSW1_0/Metadata").select('total_obs').lte(0),
  waterOccFilled = waterOcc.unmask(0).max(jrc_data0),
  waterMask = waterOccFilled.lt(95)
  return image.updateMask(waterMask);
}

var tahun19 = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
        .select('NO2_column_number_density')
        .filterBounds(jawa)  
        .filterDate('2019-01-01', '2019-8-31')
        .map(maskwater)
        .sum() 
var tahun20 = ee.ImageCollection("COPERNICUS/S5P/NRTI/L3_NO2")
        .select('NO2_column_number_density')
        .filterBounds(jawa)
        .filterDate('2020-01-01', '2020-8-31')
        .map(maskwater)
        .sum()
        

//This is Additional//
// var stacked_composite = tahun19.addBands(tahun20);

// print('NO2', stacked_composite.bandNames());

// var options = {
// title: 'Grafik Summary Kadar No2 Tahunan',
// hAxis: {title: 'Periode Waktu'},
// vAxis: {title: 'Kadar NO2'},
// lineWidth: 1,
// pointSize: 4,
// };

// var waktu = [0, 1];

// var chart = ui.Chart.image.regions(
//   stacked_composite, jawa, ee.Reducer.mean(), 30, 'label', waktu)
//   .setChartType('ScatterChart')
//   .setOptions(options);
// print(chart);

var band_viz = {
  min: 0,
  max: 0.05,
  palette: ['green', 'yellow', 'red']
};

var clip19 = tahun19.clip(jawa);
var clip20 = tahun20.clip(jawa);


var leftMap = ui.Map();
leftMap.setControlVisibility(false);

var rightMap = ui.Map();
rightMap.setControlVisibility(false);

var NO19_img = ui.Map.Layer(clip19, band_viz, 'NO2 Tahun 2019');
var NO20_img = ui.Map.Layer(clip20, band_viz, 'NO2 Tahun 2020');

var NO19_layer = leftMap.layers()
NO19_layer.add(NO19_img);

var NO20_layer = rightMap.layers()
NO20_layer.add(NO20_img)

var NO19_label = ui.Label('NO2 Tahun 2019')
NO19_label.style().set('position', 'bottom-left')

var NO20_label = ui.Label('NO2 Tahun 2020')
NO20_label.style().set('position', 'bottom-right')

leftMap.add(NO19_label)
rightMap.add(NO20_label)

var splitPanel = ui.SplitPanel({
  firstPanel: leftMap,
  secondPanel: rightMap,
  orientation: 'horizontal',
  wipe: true
});

ui.root.clear()
ui.root.add(splitPanel)

var linkPanel = ui.Map.Linker([leftMap, rightMap])
leftMap.centerObject (jawa, 7);
