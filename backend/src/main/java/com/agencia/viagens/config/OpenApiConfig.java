package com.agencia.viagens.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Agência de Viagens API")
                        .description("""
                                API completa para gestão de viagens, contratos e passageiros.
                                
                                Fluxo:
                                1. Criar contrato
                                2. Aprovar contrato
                                3. Realizar pagamento
                                4. Confirmar viagem
                                
                                Cada contrato gera um token único para consulta.""")
                        .version("2.0.0"));
    }
}
