package com.example.mediapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class login extends AppCompatActivity {

    EditText username, password;
    Button back_button, login_button;
    TextView info_text;
    int counter = 3;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        back_button = findViewById(R.id.button4);
        back_button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Back Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(backToHomeIntent);
            }
        });

        username = (EditText)findViewById(R.id.editTextTextPersonName);
        password = (EditText)findViewById(R.id.editTextTextPassword);
        info_text = (TextView)findViewById(R.id.textView4);

        login_button = findViewById(R.id.button3);
        login_button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Login Button Clicked");

                if(username.getText().toString().equals("admin") && password.getText().toString().equals("admin")){
                    Toast.makeText(getApplicationContext(), "Welcome, admin.", Toast.LENGTH_SHORT).show();
                }
                else{
                    Toast.makeText(getApplicationContext(), "Wrong credentials", Toast.LENGTH_SHORT).show();

                    info_text.setVisibility(View.VISIBLE);
                    info_text.setBackgroundColor(Color.CYAN);
                    counter--;
                    info_text.setText("Attempts: "+Integer.toString(counter));

                    if(counter == 0){
                        login_button.setEnabled(false);
                        System.out.println("Too many incorrect login, please check login details");
                    }
                }
            }
        });

    }

}