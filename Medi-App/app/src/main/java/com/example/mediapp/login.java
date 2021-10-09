package com.example.mediapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class login extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Button signup_button = findViewById(R.id.button4);
        signup_button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Button Clicked");

                Intent backToHomeIntent = new Intent(getApplicationContext(), MainActivity.class);
                startActivity(backToHomeIntent);
            }
        });
    }
}