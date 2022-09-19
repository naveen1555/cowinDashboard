import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    vaccinationReports: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationReportsDetails()
  }

  getVaccinationReportsDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedReportsData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachReport => ({
            vaccineDate: eachReport.vaccine_date,
            dose1: eachReport.dose_1,
            dose2: eachReport.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachAge => ({
          age: eachAge.age,
          count: eachAge.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_age.map(eachGender => ({
          count: eachGender.count,
          gender: eachGender.gender,
        })),
      }

      this.setState({
        vaccinationReports: updatedReportsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  renderReportsDetails = () => {
    const {vaccinationReports} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationReports={vaccinationReports.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationByGender={vaccinationReports.vaccinationByGender}
        />
        <VaccinationByAge
          vaccinationByAge={vaccinationReports.vaccinationByAge}
        />
      </>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderAllDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderReportsDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="container">
          <div className="cowin-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
              alt=" website logo"
              className="cowin-image"
            />
            <h1 className="cowin-heading">Co-WIN</h1>
          </div>
          <h1 className="cowin-details-heading">CoWIN Vaccination In India</h1>
          {this.renderAllDetails()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
