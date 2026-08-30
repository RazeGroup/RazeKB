# APK decompilers
**For further details on each tool check the original post from** [**https://eiken.dev/blog/2021/02/how-to-break-your-jar-in-2021-decompilation-guide-for-jars-and-apks/#cfr**](https://eiken.dev/blog/2021/02/how-to-break-your-jar-in-2021-decompilation-guide-for-jars-and-apks/?ref=rayanle.cat#cfr)

### @@EX1@@

As the pioneering GUI Java decompiler, **JD-Gui** allows you to investigate Java code within APK files. It's straightforward to use; after obtaining the APK, simply open it with JD-Gui to inspect the code.

### @@EX2@@

**Jadx** offers a user-friendly interface for decompiling Java code from Android applications. It's recommended for its ease of use across different platforms.

- To launch the GUI, navigate to the bin directory and execute: `jadx-gui`
- For command-line usage, decompile an APK with: `jadx app.apk`
- To specify an output directory or adjust decompilation options: `jadx app.apk -d <path to output dir> --no-res --no-src --no-imports`

### @@EX3@@

**GDA**, a Windows-only tool, offers extensive features for reverse engineering Android apps. Install and run GDA on your Windows system, then load the APK file for analysis.

### @@EX4@@

With **Bytecode-Viewer**, you can analyze APK files using multiple decompilers. After downloading, run Bytecode-Viewer, load your APK, and select the decompilers you wish to use for simultaneous analysis.

### @@EX5@@

**Enjarify** translates Dalvik bytecode to Java bytecode, enabling Java analysis tools to analyze Android applications more effectively.

- To use Enjarify, run: `enjarify app.apk` This generates the Java bytecode equivalent of the provided APK.

### @@EX6@@

**CFR** is capable of decompiling modern Java features. Use it as follows:

- For standard decompilation: `java -jar ./cfr.jar "app.jar" --outputdir "output_directory"`
- For large JAR files, adjust the JVM memory allocation: `java -Xmx4G -jar ./cfr.jar "app.jar" --outputdir "output_directory"`

### @@EX7@@

**Fernflower**, an analytical decompiler, requires building from source. After building:

- Decompile a JAR file: `java -jar ./fernflower.jar "app.jar" "output_directory"` Then, extract the `.java` files from the generated JAR using `unzip`.

### @@EX8@@

**Krakatau** offers detailed control over decompilation, especially for handling external libraries.

- Use Krakatau by specifying the standard library path and the JAR file to decompile: `./Krakatau/decompile.py -out "output_directory" -skip -nauto -path "./jrt-extractor/rt.jar" "app.jar"`

### @@EX9@@

For straightforward decompilation with **procyon**:

- Decompile a JAR file to a specified directory: `procyon -jar "app.jar" -o "output_directory"`

### @@EX10@@

This tool can be used to dump the DEX of a running APK in memory. This helps to beat static obfuscation that is removed while the application is executed in memory.
