import { Express } from 'express';
import request from 'request-promise-native';
import * as k8s from '@kubernetes/client-node';
import { KubeConfig } from '@kubernetes/client-node';
import { json } from 'body-parser';


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

    app.get(`/api/scaledobjects/:name`, async (req, res) => {
        let name = req.params.name;

        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }
        const opts: request.Options = {
            url: `${cluster.server}/apis/keda.k8s.io/v1alpha1/scaledobjects/${name}`
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
            url: `${cluster.server}/apis/autoscaling/v1/horizontalpodautoscalers/`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get(`/api/namespace/:namespace/hpa/:name`, async (req, res) => {
        let namespace = req.params.namespace;
        let name = req.params.name;
        console.log(name);

        if (!namespace) {
            namespace = 'default';
        }

        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/apis/autoscaling/v1/namespaces/${namespace}/horizontalpodautoscalers/${name}`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);

        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get(`/api/namespace/:namespace/deployment/:name`, async (req, res) => {
        let namespace = req.params.namespace;
        let name = req.params.name;

        if (!namespace) {
            namespace = 'default';
        }

        const cluster = kc.getCurrentCluster();
        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/apis/apps/v1/namespaces/${namespace}/deployments/${name}`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);

        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get('/api/keda', async (req, res) => {
        const cluster = kc.getCurrentCluster();

        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/apis/apps/v1/namespaces/keda/deployments/keda-operator`
        };
        kc.applyToRequest(opts);
        const jsonStr = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonStr);
    });

    app.get('/api/logs', async (req, res) => {
        const cluster = kc.getCurrentCluster();

        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/api/v1/namespaces/keda/pods/keda-operator-c4dcd7f47-rksj4/log`
        };
        kc.applyToRequest(opts);
        let logs = await request.get(opts);
        res.setHeader('Content-Type', 'text/plain');
        res.send(logs);
    });

    app.get('/api/logs/scaledecision', async (req, res) => {
        const cluster = kc.getCurrentCluster();

        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/api/v1/namespaces/keda/pods/keda-operator-c4dcd7f47-rksj4/log`
        };
        kc.applyToRequest(opts);
        const logs = await request.get(opts);
        res.setHeader('Content-Type', 'text/plain');

        let logsArray = logs.split("\n");
        let scaleDecisionLogs: string[] = [];
        let regexConst = new RegExp('msg.*Successfully.*deployment|Error getting scale decision|scaledObject.*cooling down|Watching ScaledObject:');

        logsArray.forEach((element:string) => {
            if (regexConst.test(element)) {

                scaleDecisionLogs.push(element + "\n");
            }
        });

        res.send(scaleDecisionLogs.toString());
    });

    app.get('/api/metrics', async (req, res) => {
        const cluster = kc.getCurrentCluster();

        if (!cluster) {
            res.status(501).json({
                error: 'cluster not found'
            });
            return;
        }

        const opts: request.Options = {
            url: `${cluster.server}/apis/external.metrics.k8s.io/v1beta1/namespaces/default/unprocessedeventthreshold`
        };
        kc.applyToRequest(opts);
        const metrics = await request.get(opts);
        res.setHeader('Content-Type', 'application/json');

        res.send(metrics);
    });
}