import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { HardwareData } from '../contexts/HardwareContext';

export class StorageService {
  private static fileName = 'solarms_history.csv';

  /**
   * Appends a new hardware reading to the physical CSV file in the Android Documents folder.
   */
  static async logData(data: HardwareData) {
    const csvLine = `${new Date(data.timestamp).toLocaleString()},${data.metrics.voltage_v},${data.metrics.current_a},${data.metrics.power_w},${data.metrics.temperature_c}\n`;
    
    try {
      await Filesystem.appendFile({
        path: this.fileName,
        data: csvLine,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    } catch (e) {
      // If the file doesn't exist yet, create it and add the header row first
      const header = 'Timestamp,Voltage(V),Current(A),Power(W),Temperature(C)\n';
      await Filesystem.writeFile({
        path: this.fileName,
        data: header + csvLine,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    }
  }

  /**
   * Reads the CSV file and returns the contents as a string.
   */
  static async readLogFile(): Promise<string> {
    try {
      const contents = await Filesystem.readFile({
        path: this.fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      return contents.data as string;
    } catch (e) {
      return 'No historical data found.';
    }
  }

  /**
   * Clears the log file (e.g. if the user wants to start fresh).
   */
  static async clearLogs() {
    const header = 'Timestamp,Voltage(V),Current(A),Power(W),Temperature(C)\n';
    await Filesystem.writeFile({
      path: this.fileName,
      data: header,
      directory: Directory.Documents,
      encoding: Encoding.UTF8,
    });
  }
  /**
   * Reads the CSV file and parses it into an array of objects for the UI.
   */
  static async getParsedLogs(): Promise<Array<{timestamp: string, voltage: string, current: string, power: string, temp: string}>> {
    try {
      const contents = await this.readLogFile();
      const lines = contents.trim().split('\n');
      if (lines.length <= 1) return []; // Only header or empty
      
      const parsed = [];
      // Skip the first line (header)
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length === 5) {
          parsed.push({
            timestamp: parts[0],
            voltage: parts[1],
            current: parts[2],
            power: parts[3],
            temp: parts[4]
          });
        }
      }
      return parsed.reverse(); // Newest first
    } catch (e) {
      return [];
    }
  }
}
