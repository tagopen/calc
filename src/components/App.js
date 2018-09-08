import React, { Component } from 'react'
import RangeSlider from './RangeSlider'

export default class App extends Component {
  constructor(props) {
    super(props)
    const data = this.props.data
    const {singleLayer, multiLayer} = data

    this.singleLayer = singleLayer
    this.multiLayer = multiLayer
    this.productsPerMonth = 0

    this.state = {
        isMultiLayer: false,
        isPrint: true,
        isCardboard: true,
        rangeValue: 0,
        salary: "",
        packing: "",
        isSalaryMaxLimit: false,
        rangeIndex: 0
    }

    this.setCapacityPerMonth(this.singleLayer)
    this.setCapacityPerMonth(this.multiLayer)

  }

  prettify(num) {
      const  n = num.toString()
      return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + " ")
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
    const isMultiLayer = this.state.isMultiLayer
    const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer
    const volumeRangeSlider = currentLayer.volume
    const currentVolumeRangeSlider = this.state.rangeValue

    const rangeIndex = volumeRangeSlider.findIndex(item => item === currentVolumeRangeSlider)

    this.setState({
      rangeValue: val,
      rangeIndex: rangeIndex
    })

  }

  setSalaryPerMonth(ev) {
    const value = ev.target.value
    let validValue = Number(value.replace(/[^0-9]/gim,''))

    switch (true) {
      case (validValue > 100000):
        validValue = validValue.toString()
        validValue = Number(validValue.substr(0, validValue.length - 1))
        this.setState({isSalaryMaxLimit : true})
        break
      case (validValue === ""):
        validValue = ""
        break
      default:
        this.setState({isSalaryMaxLimit : false})
        break
    }

    this.setState({salary: validValue})
    return validValue
  }

  setPricePacking(ev) {
    const value = ev.target.value
    let validValue = Number(value.replace(/[^0-9]/gim,''))

    if (value === "") validValue = ""

    this.setState({packing: validValue})
    return validValue
  }

  calcCapacity() {
    const isMultiLayer = this.state.isMultiLayer
    const {capacityPerMinute, workingOursPerDay, workingDaysPerMonth} = isMultiLayer ? this.multiLayer : this.singleLayer


    const productsPerHour =   capacityPerMinute * 60
    const productsPerDay =    capacityPerMinute * 60 * workingOursPerDay
    const productsPerMonth =  capacityPerMinute * 60 * workingOursPerDay * workingDaysPerMonth

    this.productsPerMonth = productsPerMonth

    return ([
      { name: "Изделий в час:", value: productsPerHour },
      { name: "Изделий в день:", value: productsPerDay },
      { name: "Изделий в месяц:", value: productsPerMonth },
    ])
  }

  calcReceipts() {
    const isMultiLayer = this.state.isMultiLayer
    const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer
    const {capacityPerMinute, workingOursPerDay, workingDaysPerMonth} = currentLayer

    const productsPerHour =   capacityPerMinute * 60
    const productsPerDay =    capacityPerMinute * 60 * workingOursPerDay
    const productsPerMonth =  capacityPerMinute * 60 * workingOursPerDay * workingDaysPerMonth

    const receiptsPerItem = () => {
      const rangeSliderIndex = this.state.rangeIndex
      const pricePacking = currentLayer.pricePacking[rangeSliderIndex]
      const pricePerItem = (this.state.packing !== "") ? this.state.packing : pricePacking
      const result = pricePerItem - this.costPricePerItem

      if (rangeSliderIndex < 0) return 0
      this.receiptsPerItem = result

      return result
    }

    const receiptsPerHour = () => {

      return this.receiptsPerItem * productsPerHour
    }

    const receiptsPerDay = () => {

      return this.receiptsPerItem * productsPerDay
    }
    const receiptsPerMonth = () => {

      return this.receiptsPerItem * productsPerMonth
    }

    return ([
      { name: "За штуку", value: receiptsPerItem() },
      { name: "В час:", value: receiptsPerHour() },
      { name: "В день:", value: receiptsPerDay() },
      { name: "В месяц:", value: receiptsPerMonth() },
    ])
  }

  calcCostPrice() {
    const isMultiLayer = this.state.isMultiLayer
    const isCardboard = this.state.isCardboard

    const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer
    const cardboardTypes = this.props.data.cardboardTypes

    const costPricePerItem = () => {
      const rawPerItemPrice = rawPerItem()
      const printPrice = print()

      return rawPerItemPrice + printPrice
    }

    const electricity = () => {
      const electricityPrice = currentLayer.electricity
      return electricityPrice / this.productsPerMonth
    }

    const salary = () => {
      const salary = this.state.salary
      const finalSalary = (salary !== "") ? salary : 40000

      return finalSalary  / this.productsPerMonth
    }

    const print = () => {
      const isPrint = this.state.isPrint
      let printCostPerItem = currentLayer.printCostPerItem
      let carveCostPerItem = currentLayer.carveCostPerItem
      let provisionPerItem = currentLayer.provisionPerItem
      const rangeSliderIndex = this.state.rangeIndex

      if (rangeSliderIndex < 0) return 0

      printCostPerItem = isPrint ? printCostPerItem[rangeSliderIndex] : 0
      carveCostPerItem = carveCostPerItem[rangeSliderIndex]
      provisionPerItem = provisionPerItem ? provisionPerItem[rangeSliderIndex] : 0

      return printCostPerItem + carveCostPerItem + provisionPerItem
    }

    const rawPerItem = () => {
      const rawPrice = isCardboard ? cardboardTypes[1].price : cardboardTypes[0].price
      const currency = this.props.data.currency.eur
      const rangeSliderIndex = this.state.rangeIndex

      const itemsPerTon = currentLayer.itemsPerTon
      return !(rangeSliderIndex < 0) ? rawPrice * 1.15 * currency / itemsPerTon[rangeSliderIndex] : 0
    }

    const boxingPrice = () => {
      const isMultiLayer = this.state.isMultiLayer
      const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer
      const glue = Number(currentLayer.boxing.glue) ? Number(currentLayer.boxing.glue) : 0
      const price = Number(currentLayer.boxing.priceForItem) ? Number(currentLayer.boxing.priceForItem) : 0

      return (glue + price)
    }
    this.costPricePerItem = costPricePerItem()

    return ([
      { name: "За одно изделие", value: this.costPricePerItem },
      { name: "Электроэнергия", value: electricity() },
      { name: "Зарплата", value: salary() },
      { name: "Печать", value: print() },
      { name: "Сырье", value: rawPerItem() },
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
    const [...receipts] = this.calcReceipts()

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
                {isCardboard ? cardboardTypes[1].name : cardboardTypes[0].name}
            </label>
          </fieldset>
          <fieldset>
            <label>Зарплата оператора в месяц, руб.<input type="text" onChange={value => this.setSalaryPerMonth(value)} value={this.state.salary} /></label>
            {this.state.isSalaryMaxLimit ? <p style={{color: "red"}}>Введите зачение от 0 до 100 000</p> : false}
          </fieldset>
          <fieldset>
            <label>Стоимость упаковки из расчета за один стакан, руб.
            <input type="text"  onChange={value => this.setPricePacking(value)} value={this.state.packing} /></label>
          </fieldset>

          <RangeSlider values = {this.getRangeSliderValues()} changeSelected={(val)=> {this.changeSelected(val)} } />
          {this.state.isMultiLayer}
        </form>
        <div>
          <h3>Производительность, шт.</h3>
          <dl>
            {
              capacity.map((item, index) => {
                const name = item.name
                const value = this.prettify(Number(item.value))
                return ([
                  <dt key={`capacity-name-${index}`}>{name}</dt>,
                  <dd key={`capacity-value-${index}`}>{value}</dd>
                ])
              })
            }
          </dl>
        </div>
        <div>
          <h3>Выручка, руб.</h3>
          <dl>
            {
              receipts.map((item, index) => {
                const name = item.name
                const value = this.prettify(Number(item.value).toFixed(2))
                return ([
                  <dt key={`receipts-name-${index}`}>{name}</dt>,
                  <dd key={`receipts-value-${index}`}>{value}</dd>
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
                const name = item.name
                const value = Number(item.value).toFixed(4)
                return ([
                  <dt key={`costprice-name-${index}`}>{name}</dt>,
                  <dd key={`costprice-value-${index}`}>{value}</dd>
                ])
              })
            }
          </dl>
        </div>
      </main>
    )
  }
}