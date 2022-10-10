# TypeScript Onion Architecture Example
Mochi-counter is a simple reference of onion architecture written by TypeScript.

To make it easy to imagine the actual production source code, Mochi-counter implemented as an Alexa application. You can deploy it to your environment with Terraform.

## Installation
```
$ cd terraform/env/dev
$ terraform init
$ make terraform-apply-auto-approve
```

## Onion architecture
See [terraform/module/mochi_counter/src](./terraform/module/mochi_counter/src/src). 

```
.
├── src
│   ├── application
│   │   ├── AddMochiUseCase.test.ts
│   │   ├── AddMochiUseCase.ts
│   │   ├── RemoveMochiUseCase.test.ts
│   │   └── RemoveMochiUseCase.ts
│   ├── domain
│   │   └── MochiCountRepository.ts
│   ├── infrastructure
│   │   ├── MochiCountRepositoryImpl.test.ts
│   │   └── MochiCountRepositoryImpl.ts
│   └── presentation
│       └── index.ts
├── scripts
│   └── build.js
├── jest.config.ts
├── package.json
├── package-lock.json
└── tsconfig.json
```

###  src
TypeScript code implemented by Onion architecture.

It includes minimal unit test code. 

**NOTE**
Mochi-counter uses Amazon DynamoDB. You can also learn how to mock AWS clients like `DynamoDBClient`.

### scripts
Build script for esbuild.

## License
MIT
