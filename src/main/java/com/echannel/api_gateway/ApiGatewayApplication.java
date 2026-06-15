package com.echannel.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions;
import org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import java.net.URI;

import static org.springframework.cloud.gateway.server.mvc.common.MvcUtils.GATEWAY_REQUEST_URL_ATTR;
import static org.springframework.web.servlet.function.RequestPredicates.path;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouterFunction<ServerResponse> userRoute() {
        return GatewayRouterFunctions.route()
                .route(path("/api/users/**"), HandlerFunctions.http())
                .before(request -> {
                    request.attributes().put(GATEWAY_REQUEST_URL_ATTR,
                            URI.create("http://user-service:8082" + request.path()));
                    return request;
                })
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> authRoute() {
        return GatewayRouterFunctions.route()
                .route(path("/api/auth/**"), HandlerFunctions.http())
                .before(request -> {
                    request.attributes().put(GATEWAY_REQUEST_URL_ATTR,
                            URI.create("http://auth-service:8081" + request.path()));
                    return request;
                })
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> appointmentRoute() {
        return GatewayRouterFunctions.route()
                .route(path("/api/appointments/**"), HandlerFunctions.http())
                .before(request -> {
                    request.attributes().put(GATEWAY_REQUEST_URL_ATTR,
                            URI.create("http://appointment-service:8083" + request.path()));
                    return request;
                })
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> paymentRoute() {
        return GatewayRouterFunctions.route()
                .route(path("/api/payments/**"), HandlerFunctions.http())
                .before(request -> {
                    request.attributes().put(GATEWAY_REQUEST_URL_ATTR,
                            URI.create("http://payment-service:8084" + request.path()));
                    return request;
                })
                .build();
    }

    @Bean
    public RouterFunction<ServerResponse> prescriptionRoute() {
        return GatewayRouterFunctions.route()
                .route(path("/api/prescriptions/**"), HandlerFunctions.http())
                .before(request -> {
                    request.attributes().put(GATEWAY_REQUEST_URL_ATTR,
                            URI.create("http://prescription-service:8085" + request.path()));
                    return request;
                })
                .build();
    }

    // ✅ FIXED: doctor-service:8086 → appointment-service:8083
    @Bean
    public RouterFunction<ServerResponse> doctorRoute() {
        return GatewayRouterFunctions.route()
                .route(path("/api/doctors/**"), HandlerFunctions.http())
                .before(request -> {
                    request.attributes().put(GATEWAY_REQUEST_URL_ATTR,
                            URI.create("http://appointment-service:8083" + request.path()));
                    return request;
                })
                .build();
    }
}