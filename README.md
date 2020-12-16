# Source Verify

This is UI part of the [source-verify](https://github.com/ethereum/source-verify).

## Demo
[Source verify demo](https://streamable.com/q82v8x)


# How to test in Remix

Create a Fetch.js file and have .sol file and metadata.json files available for verification. Sample codes

VerifyByNetwork:

```
(async () => {
    try {
        const verifyData = {
            address: '0x00C56d424FF9072779bD0df2d9bF50e759B86B58',
            chain: 'rinkeby',
            files: {
                'ballot.sol': await remix.call('fileManager', 'getFile', 'verified-sources/0x00C56d424FF9072779bD0df2d9bF50e759B86B58/ballot.sol'),
                'metadata.json': await remix.call('fileManager', 'getFile', 'verified-sources/0x00C56d424FF9072779bD0df2d9bF50e759B86B58/metadata.json'),
            }
        }
        console.log(JSON.stringify(verifyData))
        const t = await remix.call('sv', 'verifyByNetwork', verifyData.address, verifyData.chain, verifyData.files)
        console.log(t)
    } catch (e) {
        console.log(e.message)
    }
})()
```

Verify:
```
(async () => {
    try {
        const verifyData = {
            address: '0x00C56d424FF9072779bD0df2d9bF50e759B86B58',
            chain: 'rinkeby',
            files: {
                'ballot.sol': await remix.call('fileManager', 'getFile', 'verified-sources/0x00C56d424FF9072779bD0df2d9bF50e759B86B58/ballot.sol'),
                'metadata.json': await remix.call('fileManager', 'getFile', 'verified-sources/0x00C56d424FF9072779bD0df2d9bF50e759B86B58/metadata.json'),
            }
        }
        console.log(JSON.stringify(verifyData))
        const t = await remix.call('sv', 'verifyByNetwork', verifyData.address, verifyData.chain, verifyData.chain, verifyData.files)
        console.log(t)
    } catch (e) {
        console.log(e.message)
    }
})()
```

Fetch:
```
(async () => {
    try {
        console.log('fetch...')
        const t = await remix.call('sv', 'fetch', '0x00C56d424FF9072779bD0df2d9bF50e759B86B58')
        console.log(t)
    } catch (e) {
        console.log(e.message)
    }
})()
```

FetchByNetwork:
```
(async () => {
    try {
        console.log('fetch...')
        const t = await remix.call('sv', 'fetchByNetwork', '0x00C56d424FF9072779bD0df2d9bF50e759B86B58', 4)
        console.log(t)
    } catch (e) {
        console.log(e.message)
    }
})()
```
Inside a console run: 
```
remix.exeCurrent()
```
Note: javascript file should be in focus.

### VS Code Developemnt
```json
{
  "name": "sorcify-dev",
  "displayName": "Sourcify development",
  "methods": [],
  "version": "0.0.1-dev",
  "url": "/home/remix-sourcify/dist",
  "description": "Source metadata fetcher and validator",
  "icon": "https://raw.githubusercontent.com/Shard-Labs/remix-contract-getter/master/public/sourcify.png",
  "location": "sidePanel"
}
```
