# domain

ビジネスロジックを受け持つ。

## 構成要素

- model: entity
- repository: infrastructureのinterface
- service: ドメインサービス

## model

ビジネスロジックの値と処理を構造体で表す。

データはgetter/setterで取り扱う。

## repository

infrastructureのinterfaceを記載する。

## service

providerやmodelを中継する。
