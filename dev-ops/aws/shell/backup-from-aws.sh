# Backup, void drive problems on mac
docker run --rm -v $(pwd):/backup mysql:8 mysqldump \
  -u admin -p'<password bd on aws>' \
  --host=elo-mysql.xxxxxxxxxxx.eu-west-1.rds.amazonaws.com \
  --port=3306 elo-mysql > ./backup.sql

# Restore
  docker run --rm -v $(pwd):/backup mysql:8 mysql \
  -u root -p'tu_contraseña' \
  --host=127.0.0.1 \
  --port=3306 nombre_base_de_datos < ./backup.sql

# Restore on docker /backup
  docker exec -i elo-mysql mysql -u root -p'<tu_contraseña>' elo-mysql < ./backup_241201.sql