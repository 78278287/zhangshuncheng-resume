(function () {
  var el = document.getElementById('skill-radar');
  if (!el || typeof echarts === 'undefined') return;

  var style = getComputedStyle(document.documentElement);
  var accent = style.getPropertyValue('--accent').trim();
  var accent2 = style.getPropertyValue('--accent2').trim();
  var ink = style.getPropertyValue('--ink').trim();
  var rule = style.getPropertyValue('--rule').trim();
  var bg2 = style.getPropertyValue('--bg2').trim();

  var chart = echarts.init(el, null, { renderer: 'svg' });
  chart.setOption({
    animation: false,
    tooltip: {
      trigger: 'item',
      appendToBody: true,
      backgroundColor: bg2,
      borderColor: rule,
      textStyle: { color: ink, fontSize: 13 },
      formatter: function (p) {
        return p.name + '：<b>' + p.value + '</b> / 100';
      }
    },
    radar: {
      center: ['50%', '52%'],
      radius: '68%',
      splitNumber: 4,
      indicator: [
        { name: 'Excel', max: 100 },
        { name: 'Power BI', max: 100 },
        { name: 'SQL / MySQL', max: 100 },
        { name: 'Python', max: 100 },
        { name: '数据可视化', max: 100 }
      ],
      axisName: { color: ink, fontSize: 13, fontWeight: 600 },
      nameGap: 12,
      splitArea: { areaStyle: { color: [bg2, 'rgba(11,112,89,0.04)'] } },
      axisLine: { lineStyle: { color: rule } },
      splitLine: { lineStyle: { color: rule } }
    },
    series: [{
      type: 'radar',
      symbol: 'circle',
      symbolSize: 5,
      data: [{
        name: '技能熟练度',
        value: [92, 88, 85, 82, 72],
        itemStyle: { color: accent },
        lineStyle: { color: accent, width: 2.5 },
        areaStyle: { color: 'rgba(11,112,89,0.16)' },
        label: {
          show: true,
          color: accent2,
          fontFamily: 'JetBrains Mono, Consolas, monospace',
          fontSize: 12,
          fontWeight: 700,
          formatter: function (p) { return p.value; }
        }
      }]
    }]
  });

  window.addEventListener('resize', function () { chart.resize(); });
})();
