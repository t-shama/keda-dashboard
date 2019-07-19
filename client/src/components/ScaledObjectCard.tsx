import React from 'react';
import { ScaledObjectModel } from '../models/ScaledObjectModel';
import { Typography } from '@material-ui/core';

const ScaledObjectCard: React.FunctionComponent<{ scaledObject: ScaledObjectModel }> = (props) => {
    return (
        <div>
            <Typography component="p" variant="h6" gutterBottom>
                {props.scaledObject.metadata.selfLink} <br></br>
                {props.scaledObject.spec.triggers[0].type}
                {console.log(props.scaledObject.spec.triggers[0].metadata)}
            </Typography>
        </div>
    );
};

export default ScaledObjectCard;