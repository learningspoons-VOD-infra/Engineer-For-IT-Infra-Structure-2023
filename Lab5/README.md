# Lab5: Amazon Athena를 활용한 데이터 분석

## 데이터 준비

### S3 버킷 생성

Athena에 사용하는 것과 같은 AWS 리전(예: 미국 서부(오레곤) 및 계정을 사용하여 [Amazon S3에 버킷을 생성](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html)해 Athena 쿼리 결과를 보관합니다.

1. AWS Management Console에 로그인한 후 [https://console.aws.amazon.com/s3/](https://console.aws.amazon.com/s3/)에서 Amazon S3 콘솔을 엽니다.
2. 왼쪽 탐색 창에서 `버킷`을 선택합니다.
3. `버킷 만들기`를 선택합니다.
4. 아래와 같이 구성하고 `버킷 만들기` 버튼을 클릭합니다.
    - 버킷 이름 : lab5-demo-<alias>
    - AWS 리전 : 아시아 태평양(서울) ap-northeast-2
    - ACL 비활성화됨(권장) 선택

### 샘플 데이터 입력

1. S3 대시보드에서 생성한 `lab5-demo-<alias>` 버킷을 선택합니다.
2. `폴더 만들기` 버튼을 클릭하고 폴더 이름에 `cf-accesslogs`를 입력하고 `폴더 만들기` 버튼을 클릭합니다.
3. 아래 사이트에서 CloudFront 샘플 로그를 다운로드 합니다.
    - [https://github.com/aws-samples/amazon-cloudfront-log-analysis/blob/master/lab1-serveless-cloudfront-log-analysis/sample-logs/raw-logs/sample-cloudfront-access-logs.gz](https://github.com/aws-samples/amazon-cloudfront-log-analysis/blob/master/lab1-serveless-cloudfront-log-analysis/sample-logs/raw-logs/sample-cloudfront-access-logs.gz)
4. 생성한 `cf-accesslogs` 폴더를 클릭하고 `업로드` 버튼을 클릭합니다.
5. `파일 추가` 버튼을 클릭 후, 다운로드 받은 `sample-cloudfront-access-logs.gz`를 선택하고 `업로드` 버튼을 클릭합니다.

## Amazon Athena를 활용한 데이터 분석

Amazon Athena는 표준 [SQL](https://docs.aws.amazon.com/ko_kr/athena/latest/ug/ddl-sql-reference.html)을 사용하여 Amazon S3(Amazon Simple Storage Service)에 있는 데이터를 직접 간편하게 분석할 수 있는 대화형 쿼리 서비스입니다. AWS Management Console에서 몇 가지 작업을 수행하면 Athena에서 Amazon S3에 저장된 데이터를 지정하고 표준 SQL을 사용하여 임시 쿼리를 실행하여 몇 초 안에 결과를 얻을 수 있습니다.

### 데이터베이스 생성

1. [https://console.aws.amazon.com/athena/](https://console.aws.amazon.com/athena/home)에서 `Athena` 콘솔을 엽니다.
2. 왼쪽 메뉴에서 `쿼리 편집기`를 선택합니다.
3. Amazon S3에서 쿼리 결과 위치를 설정하기 위해 `설정 편집`를 선택합니다.
4. 쿼리 결과의 위치를 `앞에서 생성한 S3 버킷`으로 설정 후 `저장` 버튼을 클릭합니다.
    
    ![스크린샷 2023-06-06 오후 2.49.25.png](images/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-06-06_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_2.49.25.png)
    

`편집기` 탭을 선택합니다.

1. 아래 명령어를 입력하고 `실행` 버튼을 클릭하거나 `Ctrl+ENTER`를 눌러서 데이터베이스를 생성합니다.
    
    ```sql
    CREATE DATABASE mydatabase
    ```
    

1. 왼쪽의 데이터베이스 목록에서 `mydatabase`를 선택하면 현재 데이터베이스로 만들 수 있습니다.
    
    ![스크린샷 2023-06-06 오후 6.13.27.png](images/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-06-06_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_6.13.27.png)
    

### 테이블 생성

샘플 로그 데이터는 탭으로 구분된 값(TSV) 형식입니다. 즉, 필드를 구분하는 구분 기호로 탭 문자가 사용됩니다. 데이터는 다음 예제와 같습니다.

```sql
2014-07-05 20:00:09 DFW3 4260 10.0.0.15 GET eabcd12345678.cloudfront.net /test-image-1.jpeg 200 - Mozilla/5.0[...]
2014-07-05 20:00:09 DFW3 4252 10.0.0.15 GET eabcd12345678.cloudfront.net /test-image-2.jpeg 200 - Mozilla/5.0[...]
2014-07-05 20:00:10 AMS1 4261 10.0.0.15 GET eabcd12345678.cloudfront.net /test-image-3.jpeg 200 - Mozilla/5.0[...]
```

1. 탐색 창에서 데이터베이스에 대해 `mydatabase`가 선택되어 있는지 확인합니다.
2. 아래 쿼리에서 제일 아래쪽 `LOCATION 필드`를 수정하여 `쿼리 창`에 붙여넣고 실행합니다.
    
    ```sql
    CREATE EXTERNAL TABLE IF NOT EXISTS default.cloudfront_logs (
      `date` DATE,
      time STRING,
      location STRING,
      bytes BIGINT,
      request_ip STRING,
      method STRING,
      host STRING,
      uri STRING,
      status INT,
      referrer STRING,
      user_agent STRING,
      query_string STRING,
      cookie STRING,
      result_type STRING,
      request_id STRING,
      host_header STRING,
      request_protocol STRING,
      request_bytes BIGINT,
      time_taken FLOAT,
      xforwarded_for STRING,
      ssl_protocol STRING,
      ssl_cipher STRING,
      response_result_type STRING,
      http_version STRING,
      fle_status STRING,
      fle_encrypted_fields INT,
      c_port INT,
      time_to_first_byte FLOAT,
      x_edge_detailed_result_type STRING,
      sc_content_type STRING,
      sc_content_len BIGINT,
      sc_range_start BIGINT,
      sc_range_end BIGINT
    )
    ROW FORMAT DELIMITED 
    FIELDS TERMINATED BY '\t'
    LOCATION 's3://lab5-demo-<alias>/cf-accesslogs/'
    TBLPROPERTIES ( 'skip.header.line.count'='2' )
    ```
    

### 데이터 쿼리

Amazon S3의 데이터를 기반으로 Athena에서 생성한 `cloudfront_logs` 테이블이 있으므로 테이블에서 SQL 쿼리를 실행하고 Athena에서 결과를 볼 수 있습니다.

1. 새 쿼리 탭을 열고 쿼리 창에 다음 SQL문을 입력합니다.
    
    ```sql
    SELECT uri, COUNT(*) count 
    FROM cloudfront_logs 
    GROUP BY uri
    ```
    
2. 실행을 하면 다음과 같은 결과가 나타납니다.
    
    ![스크린샷 2023-06-10 오후 1.51.09.png](images/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-06-10_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.51.09.png)
    

### 쿼리 결과 확인

![스크린샷 2023-06-10 오후 1.52.20.png](images/%25E1%2584%2589%25E1%2585%25B3%25E1%2584%258F%25E1%2585%25B3%25E1%2584%2585%25E1%2585%25B5%25E1%2586%25AB%25E1%2584%2589%25E1%2585%25A3%25E1%2586%25BA_2023-06-10_%25E1%2584%258B%25E1%2585%25A9%25E1%2584%2592%25E1%2585%25AE_1.52.20.png)