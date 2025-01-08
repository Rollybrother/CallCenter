package com.daelim.Callcenter.Login;

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
@Table(name = "user")
@Data
@NoArgsConstructor @AllArgsConstructor
public class LoginVO {
	
	@Id
	@Column(name = "userIndex")
	private int userIndex; // 필드명 변경
	
	@Column(name = "id")
	private String id;
	
	@Column(name = "password")
	private String password;
	
	public LoginVO(String id){
		this.id = id;
	}
}
