FROM postgres:10-alpine

# копируем в ентрипоинт, потому что после билда имеджа будут экзекутнуты все файлы *.sql/ *.sh
ADD ./dump.sql /docker-entrypoint-initdb.d
