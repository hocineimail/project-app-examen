import React, { Component } from 'react'
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom'

import MainApp from './components/main_app/MainApp'
import ExamApp from './components/exam_app/ExamApp'
import Login from './components/login/Login'
import Failed from './components/failed/Failed'

import _ from 'lodash'

import LoadingScreen from 'react-loading-screen'

import { connect } from 'react-redux'

import {
  fetchUserData,
  getStudentModules,
  getStudentExams,
  getChoicesParam
} from './actions/userActions'

class AppRoutes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataUserLoaded: false,
      dataModulesLoaded: false
    }
  }
  componentDidMount() {
    this.props.fetchUserData(window.localStorage.getItem('_id'))
    this.props.getStudentModules(window.localStorage.getItem('_id'))
    this.props.getStudentExams(window.localStorage.getItem('_id'))
    this.props.getChoicesParam()
  }

  render() {
    return this.props.userData &&
      this.props.studentModules &&
      this.props.choices &&
      this.props.studentExams ? (
      <BrowserRouter>
        <Switch>
          <Route path={'/exampage'} component={ExamApp} />
          <Route
            path={'/studenthome'}
            render={() => {
              console.log('CHOICES')
              console.log(this.props.choices)
              return (
                <MainApp
                  userData={this.props.userData}
                  modules={this.props.studentModules}
                  exams={this.props.studentExams}
                  choices={this.props.choices}
                />
              )
            }}
          />
          <Route path={'/siginstudent/:id'} component={Login} />
          <Route path={'/studenterror/404'} exact component={Failed} />
          <Redirect to="/studenterror/404" />
        </Switch>
      </BrowserRouter>
    ) : (
      <LoadingScreen
        loading={this.state.isLoading}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        text="تحميل ..."
      />
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    ...props,
    ...state
  }
}

const mapActionsToProps = {
  fetchUserData,
  getStudentModules,
  getStudentExams,
  getChoicesParam
}

export default connect(
  mapStateToProps,
  mapActionsToProps
)(AppRoutes)
