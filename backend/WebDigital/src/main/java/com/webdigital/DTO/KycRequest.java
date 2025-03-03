package com.webdigital.DTO;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class KycRequest {
	private String fullName;
	private String firstName;
	private String lastName;
	private String gender;
	private String phone;
	private String email;
	private String address;
	private LocalDateTime dateOfBirth;
	private addressDetail addressDetail;
}
