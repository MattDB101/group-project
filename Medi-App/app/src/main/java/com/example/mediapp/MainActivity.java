package com.example.mediapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button signup_button = findViewById(R.id.button);
        signup_button.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Button Clicked");

                Intent activity2Intent = new Intent(getApplicationContext(), login.class);
                startActivity(activity2Intent);
            }
        });
    }
}