import React, { Component } from 'react'
import RangeSlider from './RangeSlider'

export default class App extends Component {
  constructor(props) {
    super(props)
    const data = this.props.data
    const {singleLayer, multiLayer} = data

    this.singleLayer = singleLayer
    this.multiLayer = multiLayer

    this.state = {
        isMultiLayer: false,
        isPrint: true,
        isCardboard: true,
        rangeValue: 0
    }

    this.setCapacityPerMonth(this.singleLayer)
    this.setCapacityPerMonth(this.multiLayer)

  }
  getCapacityPerMonth(data) {
    const {capacityPerMinute, workingOursPerDay, workingDaysPerMonth} = data

    return capacityPerMinute * 60 * workingOursPerDay * workingDaysPerMonth
  }

  setCapacityPerMonth(data) {
    data.capacityPerMonth = this.getCapacityPerMonth(data)
  }

  setNumbersOfLayers(value) {
    this.setState({
        isMultiLayer: !this.state.isMultiLayer
    })
  }

  setPrintTypes(value) {
    this.setState({
        isPrint: !this.state.isPrint
    })
  }
  setCardboard(value) {
    this.setState({
        isCardboard: !this.state.isCardboard
    })
  }

  getRangeSliderValues() {
    const isMultiLayer = this.state.isMultiLayer

    return isMultiLayer ? this.multiLayer.volume : this.singleLayer.volume
  }

  changeSelected(val) {
    this.setState({rangeValue: val})
  }

  calcCapacity() {
    const isMultiLayer = this.state.isMultiLayer
    const {capacityPerMinute, workingOursPerDay, workingDaysPerMonth} = isMultiLayer ? this.multiLayer : this.singleLayer


    const productsPerHour =   capacityPerMinute * 60
    const productsPerDay =    capacityPerMinute * 60 * workingOursPerDay
    const productsPerMonth =  capacityPerMinute * 60 * workingOursPerDay * workingDaysPerMonth

    return ([
      { name: "Изделий в час:", value: productsPerHour },
      { name: "Изделий в день:", value: productsPerDay },
      { name: "Изделий в месяц:", value: productsPerMonth },
    ])
  }

  calcCostPrice() {
    const isMultiLayer = this.state.isMultiLayer
    const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer

    const boxingPrice = () => {
      const glue = Number(currentLayer.boxing.glue) ? Number(currentLayer.boxing.glue) : 0
      const price = Number(currentLayer.boxing.priceForItem) ? Number(currentLayer.boxing.priceForItem) : 0

      return (glue + price)
    }

    return ([
      { name: "За одно изделие", value: "" },
      { name: "Электроэнергия", value: "" },
      { name: "Зарплата", value: "" },
      { name: "Печать", value: "" },
      { name: "Сырье", value: "" },
      { name: "Упаковка", value:  boxingPrice()},
    ])
  }


  render() {
    const isMultiLayer = this.state.isMultiLayer
    const isPrint = this.state.isPrint
    const isCardboard = this.state.isCardboard

    const data = this.props.data

    const printTypes = data.printTypes
    const cardboardTypes = data.cardboardTypes

    const [...capacity] = this.calcCapacity()

    const [...costPrice] = this.calcCostPrice()

    return (
      <main>
        <form className="calculator">
          <fieldset>
            <legend>Плотность бумаги</legend>
            <label>
                <input type="checkbox" onChange={value => this.setNumbersOfLayers(value)} name="layers" defaultChecked={isMultiLayer}/>
                {isMultiLayer ? this.multiLayer.type : this.singleLayer.type}
            </label>
          </fieldset>

          <fieldset>
            <legend>Тип печати:</legend>
            <label>
                <input type="checkbox" name="print" onChange={value => this.setPrintTypes(value)} defaultChecked={isPrint}/>
                {isPrint ? printTypes[1] : printTypes[0]}
            </label>
          </fieldset>

          <fieldset>
            <legend>Картон:</legend>
            <label>
                <input type="checkbox" name="type" onChange={value => this.setCardboard(value)} defaultChecked={isCardboard}/>
                {isCardboard ? cardboardTypes[1] : cardboardTypes[0]}
            </label>
          </fieldset>

          <RangeSlider values = {this.getRangeSliderValues()} changeSelected={(val)=> {this.changeSelected(val)} } />
          {this.state.isMultiLayer}
        </form>
        <div>
          <h3>Производительность, шт.</h3>
          <dl>
            {
              capacity.map((item, index) => {
                return ([
                  <dt key={`capacity-name-${index}`}>{item.name}</dt>,
                  <dd key={`capacity-value-${index}`}>{item.value}</dd>
                ])
              })
            }
          </dl>
        </div>
        <div>
          <h3>Себестоимость изделия, руб.</h3>
          <dl>
            {
              costPrice.map((item, index) => {
                return ([
                  <dt key={`costprice-name-${index}`}>{item.name}</dt>,
                  <dd key={`costprice-value-${index}`}>{item.value}</dd>
                ])
              })
            }
          </dl>
        </div>
      </main>
    )
  }
}