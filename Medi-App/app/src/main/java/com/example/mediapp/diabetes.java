package com.example.mediapp;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.mediapp.ml.ModelDiabetes;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.SetOptions;

import org.tensorflow.lite.DataType;
import org.tensorflow.lite.support.tensorbuffer.TensorBuffer;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class diabetes extends AppCompatActivity {

    Button predictButton;
    TextView showResult;
    EditText pregnancies, glucose, bloodPressure, skinThickness, insulin, bmi, diabetesPedigree, age;
    FirebaseFirestore db = FirebaseFirestore.getInstance();
    private FirebaseAuth mAuth;
    private static final String TAG = "DiabetesPrediction";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_diabetes);
        showResult = findViewById(R.id.textView12);
        mAuth = FirebaseAuth.getInstance();

        predictButton = findViewById(R.id.button);
        predictButton.setOnClickListener(new View.OnClickListener(){
            public void onClick(View v){
                System.out.println("Predict Button Clicked");
                String prediction = test(diabetes.this);
                float newNumber = Float.parseFloat(prediction.substring(1, prediction.length() - 1));
                int number = Math.round(newNumber);
                Log.d("Number", String.valueOf(number));
                showResult.setText(Integer.toString(number));
                updateData(number);
            }
        });
    }

    private void updateData(Integer predictionResult) {
        FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser();

        pregnancies = (EditText)findViewById(R.id.editTextTextPersonName);
        glucose = (EditText)findViewById(R.id.editTextTextPersonName2);
        bloodPressure = (EditText)findViewById(R.id.editTextTextPersonName3);
        skinThickness = (EditText)findViewById(R.id.editTextTextPersonName4);
        insulin = (EditText)findViewById(R.id.editTextTextPersonName5);
        bmi = (EditText)findViewById(R.id.editTextTextPersonName6);
        diabetesPedigree = (EditText)findViewById(R.id.editTextTextPersonName7);
        age = (EditText)findViewById(R.id.editTextTextPersonName8);;

        int number1 = Math.round(Float.parseFloat(bmi.getText().toString()) * 100) / 100;

        Map<String, Object> info = new HashMap<>();
        info.put("pregnancies", Integer.parseInt(pregnancies.getText().toString()));
        info.put("glucose", Integer.parseInt(glucose.getText().toString()));
        info.put("bloodpressure", Integer.parseInt(bloodPressure.getText().toString()));
        info.put("skinthickness", Integer.parseInt(skinThickness.getText().toString()));
        info.put("insulin", Integer.parseInt(insulin.getText().toString()));
        info.put("bmi", number1);
        info.put("dbf", Float.parseFloat(diabetesPedigree.getText().toString()));
        info.put("age", Integer.parseInt(age.getText().toString()));
        info.put("target", predictionResult);

        if (currentUser != null) {
            db.collection("patient")
                    .document(currentUser.getEmail())
                    .collection("diseases")
                    .document("diabetes")
                    .set(info, SetOptions.merge())
                    .addOnSuccessListener(new OnSuccessListener<Void>() {
                        @Override
                        public void onSuccess(Void aVoid) {
                            Log.d(TAG, "DocumentSnapshot successfully written!");
                            Toast.makeText(diabetes.this, "Info Added", Toast.LENGTH_SHORT).show();
                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.w(TAG, "Error writing document");
                            Toast.makeText(diabetes.this, "Info Not Added", Toast.LENGTH_SHORT).show();
                        }
                    });
        }
    }

    @Override
    public void onStart(){
        super.onStart();
        FirebaseUser currentUser = mAuth.getCurrentUser();
        if(currentUser != null){
            reload();
        }
    }

    public String test(Context context){
        try{
            ModelDiabetes model = ModelDiabetes.newInstance(context);

            pregnancies = (EditText)findViewById(R.id.editTextTextPersonName);
            glucose = (EditText)findViewById(R.id.editTextTextPersonName2);
            bloodPressure = (EditText)findViewById(R.id.editTextTextPersonName3);
            skinThickness = (EditText)findViewById(R.id.editTextTextPersonName4);
            insulin = (EditText)findViewById(R.id.editTextTextPersonName5);
            bmi = (EditText)findViewById(R.id.editTextTextPersonName6);
            diabetesPedigree = (EditText)findViewById(R.id.editTextTextPersonName7);
            age = (EditText)findViewById(R.id.editTextTextPersonName8);

            TensorBuffer inputFeature0 = TensorBuffer.createFixedSize(new int[]{1, 8}, DataType.FLOAT32);
            ByteBuffer buff = ByteBuffer.allocate(8 * 4);
            buff.putFloat(Float.parseFloat(pregnancies.getText().toString()));
            buff.putFloat(Float.parseFloat(glucose.getText().toString()));
            buff.putFloat(Float.parseFloat(bloodPressure.getText().toString()));
            buff.putFloat(Float.parseFloat(skinThickness.getText().toString()));
            buff.putFloat(Float.parseFloat(insulin.getText().toString()));
            buff.putFloat(Float.parseFloat(bmi.getText().toString()));
            buff.putFloat(Float.parseFloat(diabetesPedigree.getText().toString()));
            buff.putFloat(Float.parseFloat(age.getText().toString()));
            inputFeature0.loadBuffer(buff);

            ModelDiabetes.Outputs outputs = model.process(inputFeature0);
            TensorBuffer outputFeature0 = outputs.getOutputFeature0AsTensorBuffer();

            String result = Arrays.toString(outputFeature0.getFloatArray());
            model.close();
            return result;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "result";
    }

    private void reload(){ }
}