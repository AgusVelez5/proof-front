export const buildSeries = ({ metrics, name, key }) =>  {
  const accessorFn = m => m[key];

  return {
    name,
    data: metrics.map(m => ([new Date(m.timestamp).valueOf(), parseFloat(accessorFn(m))]))
  }
}

export const buildColumns = ({ metrics, name, key }) =>  {
  const accessorFn = m => m[key];

  return {
    name,
    data: metrics.map(m => (parseInt(accessorFn(m)))),
    yAxis: 0,
    visible: true,
    showInNavigator: true,
    dataLabels: {
      enabled: true,
      crop: false,
      overflow: 'none'
    }
  }
}

export const buildLineChart = (title, series) => {
  return {
    title: {
      text: title,
      align: 'left'
    },
    chart: {
      zoomType: 'x'
    },
    xAxis: {
      type: 'datetime',
      crosshair: false,
      ordinal: false,
      title: {
        text: 'Tiempo'
      }
    },
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    rangeSelector: {
      enabled: false
    },
    yAxis: [
      {
        allowDecimals: false,
        opposite: false,
        labels: {
          align: 'left',
          x: 0,
          y: -3,
          formatter: function () {
            return this.value;
          }
        },
        title: {
          text: 'Valores'
        }
      },
    ],
    series,
    tooltip: {
      pointFormatter: function() {
        return `${series.name}: <b>${this.y}</b>`
      }
    }
  }
}

export const buildBarChart = (title, categories, series) => {
  return {
    chart: {
      type: 'bar',
    },
    title: {
      text: title,
      align: 'left'
    },
    credits: {
      enabled: false
    },
    xAxis: {
      categories,
      allowDecimals: false,
      min: 0,
    },
    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: 'Valores'
      }
    },
    legend: {
      enabled: false
    },
    series
  }
}