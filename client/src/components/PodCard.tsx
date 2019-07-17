import React from 'react';
import { Typography } from '@material-ui/core';
import { V1Pod } from '@kubernetes/client-node';
import { Theme, createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
    icon: {
      verticalAlign: 'bottom',
      height: 20,
      width: 20,
    },
    details: {
      alignItems: 'center',
    },
    column: {
      flexBasis: '50%',
    },
    helper: {
      borderLeft: `2px solid ${theme.palette.divider}`,
      padding: theme.spacing(1, 2),
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }),
);

const ExpansionPanel = withStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
      color: 'black'
    },
    expanded: {},
  })(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiExpansionPanelSummary);
  
const ExpansionPanelDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);

const PodCard: React.FunctionComponent<{ pod: V1Pod }> = (props) => {
    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const classes = useStyles();

    const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <ExpansionPanel square expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <ExpansionPanelSummary aria-controls="panel1d-content" id="panel1d-header">
              <Typography component="h3" variant="h6" gutterBottom>{ props.pod.metadata!.name }</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div className={classes.column}>
                  <Typography className={classes.heading}>Status</Typography>
                  <Typography> { props.pod.status!.phase } </Typography>
                  <br></br>
                  <Typography className={classes.heading}>Selflink</Typography>
                  <Typography> { props.pod.metadata!.selfLink } </Typography>
              </div>
              <div className={classes.column}>
                  <Typography className={classes.heading}>App</Typography>
                  <Typography> { props.pod.metadata!.labels!.app } </Typography>
                  <br></br>
                  <Typography className={classes.heading}>App</Typography>
                  <Typography> { props.pod.metadata!.labels!.app } </Typography>
              </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

export default PodCard