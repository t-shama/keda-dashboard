import { Express } from 'express';
import request from 'request-promise-native';
import * as k8s from '@kubernetes/client-node';
import { KubeConfig } from '@kubernetes/client-node';


const kc = new k8s.KubeConfig()
kc.loadFromDefault();

export function setupApis(app: Express) {
    app.get('/api/scaledobjects', async (_, res) => {
        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }
        const opts: request.Options = {
            url: `${cluster.server}/apis/keda.k8s.io/v1alpha1/scaledobjects`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get('/api/namespaces', async (_, res) => {
        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/api/v1/namespaces/`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get('/api/pods', async (_, res) => {
        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/api/v1/namespaces/default/pods`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get('/api/hpa', async (_, res) => {
        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/apis/autoscaling/v1/horizontalpodautoscalers`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });
}