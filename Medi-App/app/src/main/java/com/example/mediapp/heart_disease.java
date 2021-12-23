package com.example.mediapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.res.AssetFileDescriptor;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import org.tensorflow.lite.Interpreter;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;
import java.util.HashMap;
import java.util.Map;

public class heart_disease extends AppCompatActivity {

    Interpreter tflite;
    Button predictButton;
    EditText age, gender, chestPain, bloodPressure, serumCholestrol, fastingBloodSugar, restingECG, maxHeartRate, exerciseAngina, stDepression, peakExercise, numberVessel, thal, diagnosis;
    TextView showResult;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_heart_disease);

        predictButton = findViewById(R.id.button);
        age = findViewById(R.id.editTextTextPersonName);
        gender = findViewById(R.id.editTextTextPersonName2);
        chestPain = findViewById(R.id.editTextTextPersonName11);
        bloodPressure = findViewById(R.id.editTextTextPersonName12);
        serumCholestrol = findViewById(R.id.editTextTextPersonName13);
        fastingBloodSugar = findViewById(R.id.editTextTextPersonName15);
        restingECG = findViewById(R.id.editTextTextPersonName16);
        maxHeartRate = findViewById(R.id.editTextTextPersonName17);
        exerciseAngina = findViewById(R.id.editTextTextPersonName18);
        stDepression = findViewById(R.id.editTextTextPersonName19);
        peakExercise = findViewById(R.id.editTextTextPersonName20);
        numberVessel = findViewById(R.id.editTextTextPersonName21);
        thal = findViewById(R.id.editTextTextPersonName22);
        diagnosis = findViewById(R.id.editTextTextPersonName23);
        showResult = findViewById(R.id.textView15);

        try {
            tflite = new Interpreter(loadModelFile());
        }catch (Exception ex){
            ex.printStackTrace();
        }

        predictButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                float prediction = doInference(age.getText().toString(), gender.getText().toString(), chestPain.getText().toString(), bloodPressure.getText().toString(),
                        serumCholestrol.getText().toString(), fastingBloodSugar.getText().toString(), restingECG.getText().toString(), maxHeartRate.getText().toString(),
                        exerciseAngina.getText().toString(), stDepression.getText().toString(), peakExercise.getText().toString(), numberVessel.getText().toString(),
                        thal.getText().toString(), diagnosis.getText().toString());
                System.out.println(prediction);
                showResult.setText(Float.toString(prediction));
            }
        });
    }

    private MappedByteBuffer loadModelFile() throws IOException {
        AssetFileDescriptor fileDescriptor=this.getAssets().openFd("model_heart_v3.tflite");
        FileInputStream inputStream=new FileInputStream(fileDescriptor.getFileDescriptor());
        FileChannel fileChannel=inputStream.getChannel();
        long startOffset=fileDescriptor.getStartOffset();
        long declareLength=fileDescriptor.getDeclaredLength();
        return fileChannel.map(FileChannel.MapMode.READ_ONLY,startOffset,declareLength);
    }

    /*private float doInference(String input1, String input2) {
        Map<String, Object> inputs = new HashMap<>();
        inputs.put("Age", Integer.parseInt(input1));
        inputs.put("Sex", Integer.parseInt(input2));
        Map<String, Object> outputs = new HashMap<>();
        float[][] output = new float[1][1];
        outputs.put("Percentage", output);
        tflite.run(inputs, outputs);
        return output[0][0];
    }*/

    private float doInference(String input1, String input2, String input3, String input4, String input5, String input6, String input7,
                              String input8, String input9, String input10, String input11, String input12, String input13, String input14) {
        // Map<String, Object> inputs = new HashMap<>();
        float[] inputVal1=new float[1];
        inputVal1[0]=Float.parseFloat(input1);
        // inputs.put("age", inputVal1[0]);

        float[] inputVal2=new float[1];
        inputVal2[0]=Float.parseFloat(input2);
        // inputs.put("gender", inputVal2[0]);

        float[] inputVal3=new float[1];
        inputVal3[0]=Float.parseFloat(input3);
        // inputs.put("chestPain", inputVal3[0]);

        float[] inputVal4=new float[1];
        inputVal4[0]=Float.parseFloat(input4);
        // inputs.put("bloodPressure", inputVal4[0]);

        float[] inputVal5=new float[1];
        inputVal5[0]=Float.parseFloat(input5);
        // inputs.put("serumCholestrol", inputVal5[0]);

        float[] inputVal6=new float[1];
        inputVal6[0]=Float.parseFloat(input6);
        // inputs.put("fastingBloodSugar", inputVal6[0]);

        float[] inputVal7=new float[1];
        inputVal7[0]=Float.parseFloat(input7);
        // inputs.put("restingECG", inputVal7[0]);

        float[] inputVal8=new float[1];
        inputVal8[0]=Float.parseFloat(input8);
        // inputs.put("maxHeartRate", inputVal8[0]);

        float[] inputVal9=new float[1];
        inputVal9[0]=Float.parseFloat(input9);
        // inputs.put("exerciseAngina", inputVal9[0]);

        float[] inputVal10=new float[1];
        inputVal10[0]=Float.parseFloat(input10);
        // inputs.put("stDepression", inputVal10[0]);

        float[] inputVal11=new float[1];
        inputVal11[0]=Float.parseFloat(input11);
        // inputs.put("peakExercise", inputVal11[0]);

        float[] inputVal12=new float[1];
        inputVal12[0]=Float.parseFloat(input12);
        // inputs.put("numberVessel", inputVal12[0]);

        float[] inputVal13=new float[1];
        inputVal13[0]=Float.parseFloat(input13);
        // inputs.put("thal", inputVal13[0]);

        float[] inputVal14=new float[1];
        inputVal14[0]=Float.parseFloat(input14);
        // inputs.put("diagnosis", inputVal14[0]);
        Float[] inputs = {inputVal1[0] ,inputVal2[0], inputVal3[0], inputVal4[0], inputVal5[0], inputVal6[0], inputVal7[0],
                 inputVal8[0], inputVal9[0], inputVal10[0], inputVal11[0], inputVal12[0], inputVal13[0], inputVal14[0]};

        float[][] output=new float[1][1];
        Map<Integer, Object> outputs = new HashMap<>();
        outputs.put(0, output);
        //tflite.runSignature(inputs, outputs);
        tflite.runForMultipleInputsOutputs(inputs, outputs);
        return output[0][0];
    }

}

/*
    implementation 'org.tensorflow:tensorflow-lite-task-vision:0.3.0'
    implementation 'org.tensorflow:tensorflow-lite-task-text:0.3.0'
    implementation 'org.tensorflow:tensorflow-lite-task-audio:0.3.0'
 */