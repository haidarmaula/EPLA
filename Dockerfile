# Gunakan base image Python
FROM python:3.10-slim

# Set environment variabel
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Buat direktori kerja di dalam container
WORKDIR /app

# Salin file requirements.txt dan install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Salin seluruh kode aplikasi ke dalam container
COPY . .

# Expose port 8080
EXPOSE 8080

# Jalankan aplikasi
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "app:app"]
