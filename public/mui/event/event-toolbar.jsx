import React from 'react'
import {Link, browserHistory} from 'react-router'

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import FontIcon from 'material-ui/FontIcon'
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';

import ActionDashboard from 'material-ui/svg-icons/action/dashboard'
import ActionList from 'material-ui/svg-icons/action/view-list'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'

import {plusOutline} from '../icons.jsx'

const moreIcon = <IconButton touch={true} >
					<MoreVertIcon />
				 </IconButton>
				 
const ToolbarLinkIcon = ({link, icon, ...others}) =>
	<Link to={link} activeStyle={{backgroundColor:'rgba(0,0,0,0.3)'}}>
		<IconButton ><FontIcon className="material-icons" {...others}>{icon}</FontIcon></IconButton>
	</Link>


export default class EventToolbar extends React.Component{
	state = {
		type: 'All'
	}
	selectType = (event, index, value) => this.props.onSelect(undefined, value) //this.setState({type: value})
	render() {
		const {
			eventId='rk7KCwOol', 
			types=['Performance', 'Workshop', 'Volunteer'], 
			selected='Performance', 
			onSelect
		} = this.props

		const {type} = this.state

		return <Toolbar>
			<ToolbarGroup firstChild={true}>
				<DropDownMenu value={selected} onChange={this.selectType} style={{width:'12em', paddingRight:0}}>
	            	<MenuItem value='All' primaryText="All activities" />
	            	{types.map(t => <MenuItem key={t} value={t} primaryText={t} />)}

	            </DropDownMenu>
				<ToolbarSeparator style={{marginRight:'8px'}}/>
				<ToolbarLinkIcon link={`/event/${eventId}/${selected}`} icon='view_list' />
				<ToolbarLinkIcon link={`/event/${eventId}/${selected}/Schedule`} icon='dashboard' />
			</ToolbarGroup>
			<ToolbarGroup>
				<RaisedButton primary={true} icon={plusOutline} label='Add Activity' />
				<ToolbarSeparator />
			</ToolbarGroup>
			<ToolbarTitle text="Toolbarring" />
			<ToolbarGroup>
				<IconMenu iconButtonElement={moreIcon}>
					<MenuItem primaryText="Add poster" />
					<MenuItem primaryText="Publish" />
				</IconMenu>
			</ToolbarGroup>
		</Toolbar>
	}
}