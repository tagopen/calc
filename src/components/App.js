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
        waitProduce: "",
        waitEarn: "",
        isSalaryMaxLimit: false,
        isPackingMaxLimit: false,
        rangeIndex: 0,
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

  resetValues() {
    this.setState({
      waitProduce: "",
      waitEarn: ""
    })
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
    let validValue = Number(value.replace(/[^0-9.,]/gim,''))

    switch (true) {
      case (validValue > 100000):
        validValue = validValue.toString()
        validValue = Number(validValue.substr(0, validValue.length - 1))
        this.setState({isSalaryMaxLimit : true})
        break
      case (value === ""):
        validValue = ""
        this.setState({isSalaryMaxLimit : false})
        break
      default:
        this.setState({isSalaryMaxLimit : false})
        break
    }

    this.setState({salary: validValue})
    this.resetValues()
    return value!=="" ? validValue : 40000
  }

  setPricePacking(ev) {
    const value = ev.target.value
    const rangeSliderIndex = this.state.rangeIndex
    const currentLayer = this.state.isMultiLayer ? this.multiLayer : this.singleLayer
    const pricePacking = currentLayer.pricePacking[rangeSliderIndex]
    let validValue = value.replace(/[^0-9\.]/g,'')

    if (validValue.split('.').length > 2)
      validValue = validValue.replace(/\.+$/,"")

    switch (true) {
      case (validValue > 100):
        validValue = Number(validValue.substr(0, validValue.length - 1))
        this.setState({isPackingMaxLimit : true})
        break
      case (value === "") :
        validValue = ""
        this.setState({isSalaryMaxLimit : false})
        break
      default:
        this.setState({isPackingMaxLimit : false})
        validValue = validValue
        break
    }

    this.setState({packing: validValue})
    this.resetValues()
    return value!=="" ? validValue : pricePacking
  }

  waitEarn(ev) {
    const value = ev.target.value
    let validValue = Number(value.replace(/[^0-9]/gim,''))

    let waitProduce = validValue * this.productsPerMonth / this.receiptsPerMonth
   
    waitProduce = waitProduce.toFixed(0)

    this.setState({
      waitEarn: validValue,
      waitProduce: waitProduce,
    })
    return validValue
  }

  waitProduce(ev) {
    const value = ev.target.value
    let validValue = Number(value.replace(/[^0-9]/gim,''))

    let waitEarn = validValue * this.receiptsPerMonth / this.productsPerMonth
    waitEarn = waitEarn.toFixed(0)

    this.setState({
      waitProduce: validValue,
      waitEarn: waitEarn,
    })
    return validValue
  }

  calcCapacity() {
    const isMultiLayer = this.state.isMultiLayer
    const {capacityPerMinute, workingOursPerDay, workingDaysPerMonth} = isMultiLayer ? this.multiLayer : this.singleLayer
    const capacityText = this.props.data.capacityText

    const productsPerHour =   capacityPerMinute * 60
    const productsPerDay =    capacityPerMinute * 60 * workingOursPerDay
    const productsPerMonth =  capacityPerMinute * 60 * workingOursPerDay * workingDaysPerMonth

    this.productsPerMonth = productsPerMonth

    return ([
      { name: capacityText[0], value: productsPerHour },
      { name: capacityText[1], value: productsPerDay },
      { name: capacityText[2], value: productsPerMonth },
    ])
  }

  calcReceipts() {
    const isMultiLayer = this.state.isMultiLayer
    const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer
    const {capacityPerMinute, workingOursPerDay, workingDaysPerMonth} = currentLayer

    const receiptsText = this.props.data.receiptsText

    const productsPerHour =   capacityPerMinute * 60
    const productsPerDay =    capacityPerMinute * 60 * workingOursPerDay
    const productsPerMonth =  capacityPerMinute * 60 * workingOursPerDay * workingDaysPerMonth

    const receiptsPerItem = () => {
      const rangeSliderIndex = this.state.rangeIndex
      const pricePacking = currentLayer.pricePacking[rangeSliderIndex]
      const pricePerItem = (this.state.packing !== "") ? this.state.packing : pricePacking
      const result = (pricePerItem - this.costPricePerItem)

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
      const result = this.receiptsPerItem * productsPerMonth
      this.receiptsPerMonth = result
      return result
    } 

    return ([
      { name: receiptsText[0], value: receiptsPerItem() },
      { name: receiptsText[1], value: receiptsPerHour() },
      { name: receiptsText[2], value: receiptsPerDay() },
      { name: receiptsText[3], value: receiptsPerMonth() },
    ])
  }

  calcCostPrice() {
    const isMultiLayer = this.state.isMultiLayer
    const isCardboard = this.state.isCardboard

    const costPriceText = this.props.data.costPriceText

    const currentLayer = isMultiLayer ? this.multiLayer : this.singleLayer
    const cardboardTypes = this.props.data.cardboardTypes

    const costPricePerItem = () => {
      const rawPerItemPrice = rawPerItem()
      const printCost = print()
      const electricityCost = electricity()
      const salaryCost = salary()
      const boxingCost = boxingPrice()

      return rawPerItemPrice + printCost + electricityCost + salaryCost + boxingCost
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

    const printCostPerItem = () => {
      const rangeSliderIndex = this.state.rangeIndex
      let printCostPerItem = currentLayer.printCostPerItem
      if (rangeSliderIndex < 0) return 0

      printCostPerItem = this.state.isPrint ? printCostPerItem[rangeSliderIndex] : 0

        
      return printCostPerItem
    }

    const carveCostPerItem = () => {
      const carveCostPerItem = currentLayer.carveCostPerItem
      const rangeSliderIndex = this.state.rangeIndex
      if (rangeSliderIndex < 0) return 0
        
      return carveCostPerItem[rangeSliderIndex]
    }

    this.costPricePerItem = costPricePerItem()

    return ([
      { name: costPriceText[0], value: this.costPricePerItem },
      { name: costPriceText[1], value: electricity() },
      { name: costPriceText[2], value: salary() },
      { name: costPriceText[3], value: printCostPerItem() },
      { name: costPriceText[4], value: carveCostPerItem() },
      { name: costPriceText[5], value: rawPerItem() },
      { name: costPriceText[6], value:  boxingPrice()},
    ])
  }

  render() {
    const isMultiLayer = this.state.isMultiLayer
    const isPrint = this.state.isPrint
    const isCardboard = this.state.isCardboard

    const [...capacity] = this.calcCapacity()
    const [...costPrice] = this.calcCostPrice()
    const [...receipts] = this.calcReceipts()

    return (
      <section className="calc">
        <div className="container">
          <div className="row">
            <div className="col-24 text-center">
              <h2 className="calc__heading">{this.props.data.heading}</h2>
              <p className="calc__subheading">{this.props.data.subHeading}</p>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-22 col-md-8">
              <figure className="calc__picture">
                <img
                  className="calc__img img-fluid"
                  src={!this.state.isPrint ? "/img/s2.png" : !this.state.isMultiLayer ? "/img/s3.png" : "/img/s1.png"}
                  alt="стакан"
                  style={{transform: `scale(1.${this.state.rangeIndex})`}}
                />
              </figure>
            </div>
            <div className="col-24 col-md-16">
              <div className="calc__info c-info">
                <div className="c-info__heading">{this.props.data.info.heading}</div>
                <div className="row">
                  <div className="col-xs-24 col-lg-12 col-xl-10">
                    <div className="c-info__property">
                      <div className="c-info__title">{this.props.data.info.title}</div>
                      <div className="c-info__switch switch" />
                      <div className="switch__box">
                        <input
                          className="switch__input"
                          id="checkbox1"
                          name="checkbox1"
                          type="checkbox"
                          onChange={value => this.setNumbersOfLayers(value)}
                          defaultChecked={isMultiLayer}
                        />
                        <label
                          className="switch__label switch__label--1"
                          htmlFor="checkbox1"
                        >
                          {this.props.data.info.switch1}
                        </label>
                        <label
                          className="switch__label switch__label--2"
                          htmlFor="checkbox1"
                        >
                          {this.props.data.info.switch2}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-24 col-lg-12 col-xl-14">
                    <div className="c-info__range">
                      <div className="c-info__title">
                        {this.props.data.info.range}
                      </div>
                      <RangeSlider 
                        values = {this.getRangeSliderValues()} 
                        changeSelected={(val)=> {this.changeSelected(val)} } 
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-24 col-sm-14 col-lg-11 col-xl-10">
                    <div className="c-info__property c-info__property--border">
                      <div className="c-info__title">Тип печати:</div>
                      <div className="c-info__switch switch" />
                      <div className="switch__box">
                        <input
                          className="switch__input"
                          id="checkbox2"
                          name="checkbox2"
                          type="checkbox"
                          onChange={value => this.setPrintTypes(value)}
                          defaultChecked={isPrint}
                        />
                        <label
                          className="switch__label switch__label--1"
                          htmlFor="checkbox2"
                        >
                          {this.props.data.info.switch3}
                        </label>
                        <label
                          className="switch__label switch__label--2"
                          htmlFor="checkbox2"
                        >
                          {this.props.data.info.switch4}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-24 col-sm-10 col-lg-10 col-xl-10">
                    <div className="c-info__property">
                      <div className="c-info__title">{this.props.data.info.package}</div>
                      <div className="c-info__switch switch" />
                      <div className="switch__box">
                        <input
                          className="switch__input"
                          id="checkbox3"
                          name="checkbox3"
                          type="checkbox"
                          onChange={value => this.setCardboard(value)} 
                          defaultChecked={isCardboard}
                        />
                        <label
                          className="switch__label switch__label--1"
                          htmlFor="checkbox3"
                        >
                          {this.props.data.info.country1}
                        </label>
                        <label
                          className="switch__label switch__label--2"
                          htmlFor="checkbox3"
                        >
                          {this.props.data.info.country2}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-24 col-sm-12">
                    <div className="c-info__char c-char">
                      <div className="row">
                        <div className="col-12">
                          <div className="c-char__text">
                            {this.props.data.info.label1}
                          </div>
                        </div>
                        <div className="col-12">
                          <input 
                            className="c-char__input" 
                            type="text" 
                            onChange={value => this.setSalaryPerMonth(value)} 
                            value={this.state.salary}
                          />
                          {
                            this.state.isSalaryMaxLimit ? 
                              <p className="c-char__text" style={{color: "#e14758"}}>{this.props.data.info.label1Error}</p> : 
                              false
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xs-24 col-sm-12">
                    <div className="c-info__char c-char">
                      <div className="row">
                        <div className="col-12">
                          <div className="c-char__text">
                            
                            {this.props.data.info.label2}
                          </div>
                        </div>
                        <div className="col-12">
                          <input 
                            className="c-char__input" 
                            type="text" 
                            onChange={value => this.setPricePacking(value)} 
                            value={this.state.packing}
                          />

                          {
                            this.state.isPackingMaxLimit ? 
                              <p className="c-char__text" style={{color: "#e14758"}}>{this.props.data.info.label2Error}</p> : 
                              false
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  { 
                    (this.receiptsPerMonth <= 0) ?
                      <div className="col-24 mt-3 text-center"><p className="c-char__text" style={{color: "#e14758"}}>{this.props.data.info.receiptsError}</p></div> :
                      false
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="result">
            <div className="row">
              <div className="col-xs-24 col-md-12 col-xl-8 result__col result__col--1">
                <div className="result__box">
                  <div className="result__heading" dangerouslySetInnerHTML={{ __html: this.props.data.capacity[0] }}>
                  </div>
                  <table className="table table-borderless result__table">
                    <tbody>
                      {
                        capacity.map((item, index) => {
                          const name = item.name
                          const value = this.prettify(Number(item.value))
                          return (
                            <tr className="result__row" key={`capacity-${index}`}>
                              <td className="result__data result__data--left">{name}</td>
                              <td className="result__data result__data--right">{value}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  <div className="result__heading result__heading--small result__heading--margin" dangerouslySetInnerHTML={{ __html: this.props.data.capacity[1] }}>
                  </div>
                  <input 
                    className="c-char__input c-char__input--small" 
                    type="text" 
                    onChange={value => this.waitProduce(value)} 
                    value={this.state.waitProduce}
                  />
                </div>
              </div>
              <div className="col-xs-24 col-md-12 col-xl-8 result__col result__col--2">
                <div className="result__box">
                  <div className="result__heading" dangerouslySetInnerHTML={{ __html: this.props.data.receipts[0] }}>
                  </div>
                  <table className="table table-borderless result__table">
                    <tbody>
                      {
                        receipts.map((item, index) => {
                          const name = item.name
                          const value = this.prettify(Number(item.value).toFixed(2))
                          return (
                            <tr className="result__row" key={`receipts-${index}`}>
                              <td className="result__data result__data--left">{name}</td>
                              <td className="result__data result__data--right">{value}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                  <div className="result__heading result__heading--small result__heading--margin" dangerouslySetInnerHTML={{ __html: this.props.data.receipts[1] }}>
                    
                  </div>
                  <input 
                    className="c-char__input c-char__input--small" 
                    type="text" 
                    onChange={value => this.waitEarn(value)} 
                    value={this.state.waitEarn}
                  />
                </div>
              </div>
              <div className="col-xs-24 col-md-24 col-xl-8 result__col result__col--3">
                <div className="result__box">
                  <div className="result__heading result__heading--dark" dangerouslySetInnerHTML={{ __html: this.props.data.costPrice[0] }}>
                    
                  </div>
                  <table className="table table-borderless result__table">
                    <tbody>
                      {
                        costPrice.map((item, index) => {
                          const name = item.name
                          const value = Number(item.value).toFixed(4)
                          return (
                            <tr className="result__row" key={`costprice-${index}`}>
                              <td className="result__data result__data--dark result__data--left">{name}</td>
                              <td className="result__data result__data--dark result__data--right">{value}</td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-24 col-md-20">
                <div className="result__call text-center">
                  {this.props.data.result} 
                </div>
              </div>  
            </div>
          </div>
        </div>
      </section>

    )
  }
}