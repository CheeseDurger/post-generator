# Overview
This codebase provision all of the infrastrcture for the staging and production environments.

# Folder structure
```
.
├── 01-shared                  # Resources shared among environments (eg. one domain name for all the environments)
├── 02-main                    # Resources not shared among environments (eg. one s3 bucket per environment)
└── ...
```

The resources of the `01-shared` folder must be provisioned before the resources of the `02-main` folder.

## `01-shared` folder
This folder provisions the resources shared among staging and production environments : domain name, DSN zone, certificate, etc...

To provision those resources :
```terraform
cd 01-shared/
terraform init
terraform apply
```

Note : considering which resources to share among environments has been a balance between a cost efficient architecture, and a loosely coupled architecture.

Note : there are no terraform workspaces in this folder.

## `02-main` folder
This folder provisions the resources not shared among staging and production environments : s3 buckets, lambda functions, cloudfront distributions, databases, etc...

### 1. Configure secrets
Duplicate `tfvars/secrets.example.tfvars` into `tfvars/secrets.tfvars` and update the new file following the instructions it contains.

### 2. Initialize terraform
**WARNING** : environments are managed with terraform **workspaces** :
- `default` workspace for the staging environment
- `production` workspace for the production environment

Start with :
```terraform
terraform init
terraform workspace list
terraform select <default or production>
```

### 3. Plan/apply changes
**Prerequisites** : you must have a `./build.zip` file from here. It contains the zipped js files for the backend. Indeed, lambda cannot be provisionned without some code to be uploaded. 

To plan/apply changes on staging from root module (on `default` workspace) : `terraform plan --var-file=tfvars/common.tfvars --var-file=tfvars/staging.tfvars --var-file=tfvars/staging.secrets.tfvars`

To plan/apply only 1 module on production from root module (on `production` workspace) : `terraform apply --var-file=tfvars/common.tfvars --var-file=tfvars/production.tfvars --var-file=tfvars/production.secrets.tfvars --target="module.lambda"`

**BEWARE** : do not apply staging `tfvars` in production or vice versa.
