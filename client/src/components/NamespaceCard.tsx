import React from 'react';
import { Typography } from '@material-ui/core';
import { V1Namespace } from '@kubernetes/client-node';

const NamespaceCard: React.FunctionComponent<{ namespace: V1Namespace }> = (props) => {
    return (
        <Typography component="p" gutterBottom>
            {props.namespace.metadata!.selfLink}
        </Typography>
    );
};

export default NamespaceCard;