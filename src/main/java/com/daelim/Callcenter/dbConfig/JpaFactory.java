package com.daelim.Callcenter.dbConfig;

import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;

import org.springframework.core.env.Environment;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;

/** Keeps each database's dialect and schema settings in its own persistence unit. */
final class JpaFactory {

    private JpaFactory() {
    }

    static LocalContainerEntityManagerFactoryBean create(DataSource dataSource, String unit,
            Environment environment, String... packages) {
        String prefix = "app.jpa." + unit + ".";
        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.dialect", environment.getRequiredProperty(prefix + "dialect"));
        properties.put("hibernate.hbm2ddl.auto", environment.getProperty(prefix + "ddl-auto", "none"));
        // Preserve existing mixed-case columns (userIndex, indexNum, manInCall, ...).
        properties.put("hibernate.physical_naming_strategy",
                "org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl");
        properties.put("hibernate.show_sql", environment.getProperty("spring.jpa.show-sql", "false"));
        properties.put("hibernate.format_sql", true);

        LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
        factory.setDataSource(dataSource);
        factory.setPersistenceUnitName(unit);
        factory.setPackagesToScan(packages);
        factory.setJpaVendorAdapter(new HibernateJpaVendorAdapter());
        factory.setJpaPropertyMap(properties);
        return factory;
    }
}
