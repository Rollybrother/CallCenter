package com.daelim.Callcenter.Acpt;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "sat101")
@Data
@NoArgsConstructor @AllArgsConstructor
public class AcptVO {
	
	@Id
	@Column(name = "ASRCPTNO")
	private String ASRCPTNO;
	
	@Column(name = "RCPTDATE")
	private String RCPTDATE;
	
	@Column(name = "RASMANCD")
	private String RASMANCD;
	
}
