import * as cdk from 'aws-cdk-lib';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';

export class StaticSiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket for the website
    const siteBucket = new Bucket(this, 'StaticSiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy site contents to S3 bucket
    new s3Deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3Deploy.Source.asset('./site')],
      destinationBucket: siteBucket,
    });

    new cdk.CfnOutput(this, 'BucketWebsiteURL', {
      value: siteBucket.bucketWebsiteUrl,
      description: 'S3 Website URL',
    });
  }
}
