FROM nginx:latest
EXPOSE 8081
# RUN echo "deb http://security.debian.org/debian-security stretch/updates main" > /etc/apt/sources.security.only.list
# RUN apt-get -y update -o Dir::Etc::SourceList=/etc/apt/sources.security.only.list -o Dir::Etc::Parts=/dev/null
# RUN apt-get -y upgrade -o Dir::Etc::SourceList=/etc/apt/sources.security.only.list -o Dir::Etc::Parts=/dev/nulld
RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
# COPY scripts/docker/start-nginx.sh /usr/share/nginx/start-nginx.sh
COPY dist/frontend-pm /opt/app-root/src
# COPY version /usr/share/nginx/html/assets/version
# ENTRYPOINT ["/usr/share/nginx/start-nginx.sh"]