package com.daelim.Callcenter.dbConfig;

import javax.sql.DataSource;
import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;

@Configuration(proxyBeanMethods = false)
@EnableJpaRepositories(
        basePackages = {"com.daelim.Callcenter.Acpt"},
        entityManagerFactoryRef = "acptEntityManagerFactory",
        transactionManagerRef = "acptTransactionManager")
public class AcptConfig {

    @Bean
    @ConfigurationProperties("spring.second-datasource")
    public DataSourceProperties acptDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    @ConfigurationProperties("spring.second-datasource.hikari")
    public HikariDataSource acptDataSource(
            @Qualifier("acptDataSourceProperties") DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().type(HikariDataSource.class).build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean acptEntityManagerFactory(
            @Qualifier("acptDataSource") DataSource dataSource, Environment environment) {
        return JpaFactory.create(dataSource, "db2", environment, "com.daelim.Callcenter.Acpt");
    }

    @Bean
    public JpaTransactionManager acptTransactionManager(
            @Qualifier("acptEntityManagerFactory") EntityManagerFactory factory) {
        return new JpaTransactionManager(factory);
    }
}
