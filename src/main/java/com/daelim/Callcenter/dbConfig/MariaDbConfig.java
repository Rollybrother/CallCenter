package com.daelim.Callcenter.dbConfig;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

@Configuration(proxyBeanMethods = false)
@EnableJpaRepositories(
        basePackages = {"com.daelim.Callcenter.Login", "com.daelim.Callcenter.Stat"},
        entityManagerFactoryRef = "mariaEntityManagerFactory",
        transactionManagerRef = "mariaTransactionManager")
public class MariaDbConfig {

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource")
    public DataSourceProperties mariaDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @Primary
    @ConfigurationProperties("spring.datasource.hikari")
    public HikariDataSource mariaDataSource(
            @Qualifier("mariaDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    @Bean
    @Primary
    public LocalContainerEntityManagerFactoryBean mariaEntityManagerFactory(
            @Qualifier("mariaDataSource") DataSource dataSource, Environment environment) {
        return JpaFactory.create(dataSource, "maria", environment, "com.daelim.Callcenter.Login", "com.daelim.Callcenter.Stat");
    }

    @Bean
    @Primary
    public JpaTransactionManager mariaTransactionManager(
            @Qualifier("mariaEntityManagerFactory") EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }
}
