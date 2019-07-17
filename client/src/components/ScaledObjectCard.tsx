import React from 'react';
import { ScaledObjectModel } from '../models/ScaledObjectModel';
import { Typography } from '@material-ui/core';

const ScaledObjectCard: React.FunctionComponent<{ scaledObject: ScaledObjectModel }> = (props) => {
    return (
        <Typography component="p" variant="h6" gutterBottom>
            {props.scaledObject.metadata.selfLink} <br></br>
            {props.scaledObject.metadata.triggerType}
        </Typography>
    );
};

export default ScaledObjectCard;